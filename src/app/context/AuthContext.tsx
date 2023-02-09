import { createContext, PropsWithChildren, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@chakra-ui/react";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";

import {
    useDeleteUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useRegisterUserMutation,
    useResetPasswordMutation,
    useUpdateUserMutation,
} from "../api/auth";
import { User } from "../../util/models/User";
import { useAppSelector } from "../store/hooks";
import { AppRoutes } from "../../util/routes";

type AuthContextState = {
    user: User | null;
    token: string | null;
    loginUser: (params: MutationParams<typeof useLoginUserMutation>) => Promise<void>;
    deleteUser: (params: MutationParams<typeof useDeleteUserMutation>) => Promise<void>;
    logoutUser: (params: MutationParams<typeof useLogoutUserMutation>) => Promise<void>;
    updateUser: (params: MutationParams<typeof useUpdateUserMutation>) => Promise<void>;
    registerUser: (params: MutationParams<typeof useRegisterUserMutation>) => Promise<void>;
    resetUserPassword: (params: MutationParams<typeof useResetPasswordMutation>) => Promise<void>;
};

// get the parameter types of any defined endpoints
type MutationParams<M> = M extends UseMutation<infer D>
    ? D extends MutationDefinition<infer Params, any, any, any>
        ? Params
        : never
    : never;

export const AuthContext = createContext<AuthContextState | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const toast = useToast();
    const navigate = useNavigate();
    const [login] = useLoginUserMutation();
    const [logout] = useLogoutUserMutation();
    const [register] = useRegisterUserMutation();
    const [_delete] = useDeleteUserMutation();
    const [update] = useUpdateUserMutation();
    const [resetPassword] = useResetPasswordMutation();
    const { user, token } = useAppSelector(state => state._auth);

    useEffect(() => {
        if (!token || !user) {
            navigate(AppRoutes.Home, { replace: true });
        }

    }, [token, user]);

    const loginUser = useCallback(
        async (params: MutationParams<typeof useLoginUserMutation>) => {
            try {
                await login(params).unwrap();
                toast({
                    status: "success",
                    description: "Login successful!",
                });
            }
            catch (e) {
                console.log(e);
                toast({
                    status: "error",
                    description: (e as any).message,
                });
            }
        }, []);

    const logoutUser = useCallback(
        async (params: MutationParams<typeof useLogoutUserMutation>) => {
            try {
                await logout(params).unwrap();
                toast({
                    status: "success",
                    description: "Signed out of your account!",
                });
            }
            catch (e) {
                console.warn("Could not sign out user", e);
                toast({
                    status: "error",
                    description: "There was a problem logging out. Please try again.",
                });
            }
        },
        [],
    );

    const registerUser = useCallback(
        async (params: MutationParams<typeof useRegisterUserMutation>) => {
            try {
                await register(params).unwrap();
                toast({
                    status: "success",
                    description: "Account registered! Welcome to buybay!",
                });
            }
            catch (e) {
                console.warn("Could not create user", e);
                toast({
                    status: "error",
                    description: "There was a problem registering your account. Please try again.",
                });
            }
        }, []);

    const deleteUser = useCallback(
        async (params: MutationParams<typeof useDeleteUserMutation>) => {
            try {
                await _delete(params).unwrap();
                toast({
                    status: "success",
                    description: "Account deleted.",
                });
            }
            catch (e) {
                console.warn("Could not delete user", e);
                toast({
                    status: "error",
                    description: "There was a problem deleting your account. Please try again.",
                });
            }
        }, []);

    const updateUser = useCallback(
        async (params: MutationParams<typeof useUpdateUserMutation>) => {
            try {
                await update(params).unwrap();
                navigate(AppRoutes.Home);
                toast({
                    status: "success",
                    description: "Updated account details!",
                });
            }
            catch (e) {
                console.warn("Could not update user", e);
                toast({
                    status: "error",
                    description: "There was a problem updating your account. Please try again.",
                });
            }
        }, []);

    const resetUserPassword = useCallback(
        async (params: MutationParams<typeof useResetPasswordMutation>) => {
            try {
                await resetPassword(params).unwrap();
                console.log("Reset user password");
                toast({
                    status: "success",
                    description: "Updated password!",
                });
            }
            catch (e) {
                console.log("Could not reset user password", e);
                toast({
                    status: "error",
                    description: "There was a problem resetting your password. Please try again.",
                });
            }
        },
        [],
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loginUser,
                logoutUser,
                registerUser,
                deleteUser,
                updateUser,
                resetUserPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;