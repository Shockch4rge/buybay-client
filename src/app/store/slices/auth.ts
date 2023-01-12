import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../../util/models/User";
import authService from "../../api/auth";


type AuthState = {
    token: string | null;
    user: User | null;
};

const initialState: AuthState = {
    token: localStorage.getItem("token") ?? null,
    user: null,
};

const authSlice = createSlice({
    name: "_auth",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addMatcher(authService.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
                localStorage.setItem("token", payload.token);
                state.token = localStorage.getItem("token")!;
                state.user = payload.user;
            })
            .addMatcher(authService.endpoints.registerUser.matchFulfilled, (state, { payload }) => {
                localStorage.setItem("token", payload.token);
                state.token = localStorage.getItem("token")!;
                state.user = payload.user;
            })
            .addMatcher(
                authService.endpoints.getCurrentUser.matchFulfilled,
                (state, { payload }) => {
                    state.user = payload.user;
                },
            )
            .addMatcher(authService.endpoints.signOutUser.matchFulfilled, state => {
                localStorage.removeItem("token");
                state.token = null;
                state.user = null;
            })
            .addMatcher(authService.endpoints.deleteUser.matchFulfilled, state => {
                localStorage.removeItem("token");
                state.token = null;
                state.user = null;
            });
    },
});

export default authSlice;