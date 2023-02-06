import "./util/theme/index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import theme from "./util/theme";
import { Provider } from "react-redux";
import store from "./app/store";
import { AuthProvider } from "./app/context/AuthContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <ChakraProvider theme={theme}>
        <Provider store={store}>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    </ChakraProvider>,
);

if (window.Cypress) {
    window.store = store;
}
