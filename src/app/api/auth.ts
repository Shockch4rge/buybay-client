import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, UserSchema } from "../../util/models/User";
import { RootState } from "../store";
import { z } from "zod";

const ResSchema = z.object({
    message: z.string(),
});

const AuthorizedResSchema = ResSchema.extend({
    user: UserSchema,
    token: z.string(),
});

type AuthorizedRes = z.infer<typeof AuthorizedResSchema>;

const UserResSchema = AuthorizedResSchema.omit({ token: true });

type UserRes = z.infer<typeof UserResSchema>;

const authApi = createApi({
    reducerPath: "auth",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_USERS_API,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).slices._auth.token;

            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    endpoints: builder => ({
        getCurrentUser: builder.query<AuthorizedRes, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),

            transformResponse: async (res: AuthorizedRes) => {
                return {
                    ...res,
                    user: await UserSchema.parseAsync(res),
                };
            },
        }),

        getUser: builder.query<UserRes, User["id"]>({
            query: userId => ({
                url: `/auth/${userId}`,
                method: "GET",
            }),
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
        }),

        signOutUser: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        registerUser: builder.mutation<
            AuthorizedRes,
            Pick<User, "email" | "name"> & { password: string }
        >({
            query: ({ email, name, password }) => ({
                url: `/auth/register`,
                method: "POST",
                body: {
                    name,
                    email,
                    password,
                },
            }),
        }),

        updateUser: builder.mutation<
            AuthorizedRes,
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
    useSignOutUserMutation,
    useUpdateUserMutation,
    useResetPasswordMutation,
    useDeleteUserMutation,
    useLazyGetCurrentUserQuery,
} = authApi;

export default authApi;