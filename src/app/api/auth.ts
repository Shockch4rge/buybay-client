import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, UserSchema } from "../../util/models/User";
import { RootState } from "../store";
import { z } from "zod";
import cacheUtils from "../../util/cacheUtils";
import { Res } from "./index";

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

const Tag = {
    User: "User",
};

const authApi = createApi({
    reducerPath: "auth",

    tagTypes: [...cacheUtils.defaultTags, Tag.User],

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
        getUser: builder.query<User, User["id"]>({
            query: userId => ({
                url: `/users/${userId}`,
                method: "GET",
            }),

            transformResponse: async (res: AuthorizedRes) => UserSchema.parseAsync(res.user),

            providesTags: cacheUtils.cacheByIdArg(Tag.User),
        }),

        getCurrentUser: builder.query<UserRes, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),

            // transformResponse: (res: UserRes) => UserResSchema.parseAsync(res),
        }),

        loginUser: builder.mutation<AuthorizedRes, Pick<User, "email"> & { password: string }>({
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

        registerUser: builder.mutation<AuthorizedRes, FormData>({
            query: form => ({
                url: `/auth/register`,
                method: "POST",
                body: form,
            }),

            transformResponse: (res: AuthorizedRes) => AuthorizedResSchema.parseAsync(res),

            invalidatesTags: cacheUtils.invalidatesList(Tag.User),
        }),

        updateUser: builder.mutation<User, Pick<User, "id"> & { form: FormData }>({
            query: ({ id, form }) => ({
                url: `/users/${id}?_method=PUT`,
                method: "POST",
                body: form,
            }),

            transformResponse: (res: Res<{ user: User }>) => UserSchema.parseAsync(res.user),

            invalidatesTags: cacheUtils.invalidatesList(Tag.User),
        }),

        resetPassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
            query: ({ oldPassword, newPassword }) => ({
                url: `/auth/reset-password`,
                method: "POST",
                body: { oldPassword, newPassword },
            }),
        }),

        deleteUser: builder.mutation<void, { password: string }>({
            query: body => ({
                url: `/auth/destroy`,
                method: "DELETE",
                body,
            }),

            invalidatesTags: cacheUtils.invalidatesList(Tag.User),
        }),
    }),
});


export const {
    useGetUserQuery,
    useLoginUserMutation,
    useRegisterUserMutation,
    useLogoutUserMutation,
    useUpdateUserMutation,
    useResetPasswordMutation,
    useDeleteUserMutation,
    useLazyGetCurrentUserQuery,
} = authApi;

export default authApi;