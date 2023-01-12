import "./util/theme/index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import theme from "./util/theme";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import store from "./app/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            redirectUri={import.meta.env.VITE_AUTH0_REDIRECT_URI}
        >
            <ChakraProvider theme={theme}>
                <Provider store={store}>
                    <App />
                </Provider>
            </ChakraProvider>
        </Auth0Provider>
    </React.StrictMode>,
);
