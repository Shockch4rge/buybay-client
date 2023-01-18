import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, UserSchema } from "../../util/models/User";
import { RootState } from "../store";
import { z } from "zod";

const AuthorizedResSchema = z.object({
    user: UserSchema,
    message: z.string(),
    token: z.string(),
});

type AuthorizedRes = z.infer<typeof AuthorizedResSchema>;

const UserResSchema = z.object({
    user: UserSchema,
    message: z.string(),
});

type UserRes = z.infer<typeof UserResSchema>;

const authApi = createApi({
    reducerPath: "auth",

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_USERS_API,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState)._auth.token;

            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    endpoints: builder => ({
        getCurrentUser: builder.query<UserRes, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),

            transformResponse: (res: UserRes) => UserResSchema.parseAsync(res),
        }),

        getUser: builder.query<AuthorizedRes, User["id"]>({
            query: userId => ({
                url: `/auth/${userId}`,
                method: "GET",
            }),

            transformResponse: async (res: AuthorizedRes) => AuthorizedResSchema.parseAsync(res),
        }),

        loginUser: builder.mutation<
            AuthorizedRes,
            Pick<User, "email"> & { password: string }
        >({
            query: ({ email, password }) => ({
                url: `/auth/login`,
                method: "POST",
                body: { email, password },
            }),

            transformResponse: (res: AuthorizedRes) => AuthorizedResSchema.parseAsync(res),
        }),

        logoutUser: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        registerUser: builder.mutation<
            AuthorizedRes,
            FormData
        >({
            query: form => ({
                url: `/auth/register`,
                method: "POST",
                body: form,
            }),

            transformResponse: (res: AuthorizedRes) => AuthorizedResSchema.parseAsync(res),
        }),

        updateUser: builder.mutation<
            User,
            Partial<Pick<User, "email" | "name">> & Pick<User, "id">
        >({
            query: ({id, email, name}) => ({
                url: `/auth/update/${id}`,
                method: "PUT",
                body: {
                    email,
                    name,
                },
            }),

            transformResponse: (res: UserRes) => UserSchema.parseAsync(res),
        }),

        resetPassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
            query: ({ oldPassword, newPassword }) => ({
                url: `/auth/reset-password`,
                method: "POST",
                body: { oldPassword, newPassword },
            }),
        }),

        deleteUser: builder.mutation<void, void>({
            query: () => ({
                url: `/auth/destroy`,
                method: "DELETE",
            }),
        }),
    }),
});


export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useLogoutUserMutation,
    useUpdateUserMutation,
    useResetPasswordMutation,
    useDeleteUserMutation,
    useLazyGetCurrentUserQuery,
} = authApi;

export default authApi;