import { Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";
import { CartPage } from "./pages/cart/CartPage";
import { AppRoutes } from "./util/routes";
import { ProductPage } from "./pages/product/ProductPage";
import { useAuth } from "./app/context/AuthContext";
import React, { useEffect } from "react";
import { useLazyGetCurrentUserQuery } from "./app/api/auth";
import { LoginModal } from "./pages/common/LoginModal";
import { ResetPasswordModal } from "./pages/common/ResetPasswordModal";
import { SellProductPage } from "./pages/sell-product/SellProductPage";
import { RegistrationPage } from "./pages/registration/RegistrationPage";
import { AccountPage } from "./pages/account/AccountPage";
import { EditProductPage } from "./pages/edit-product/EditProductPage";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutSuccessPage } from "./pages/checkout/CheckoutSuccessPage";
import { CheckoutCancelledPage } from "./pages/checkout/CheckoutCancelledPage";
import { OrderPage } from "./pages/order/OrderPage";
import { LandingPage } from "./pages/landing/LandingPage";

const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App: React.FC = () => {
    const { token } = useAuth();
    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        if (!token) return;

        getCurrentUser().unwrap();
    }, []);

    return <>
        <Routes>
            <Route index element={<LandingPage/>} />
            <Route path={AppRoutes.Home} element={<HomePage />} />
            <Route path={AppRoutes.Cart} element={<CartPage />} />
            <Route path={AppRoutes.Product(":id")} element={<ProductPage />} />
            <Route path={AppRoutes.SellProduct} element={<SellProductPage />} />
            <Route path={AppRoutes.EditProduct(":id")} element={<EditProductPage />} />
            <Route path={AppRoutes.Registration} element={<RegistrationPage />} />
            <Route path={AppRoutes.Account} element={<AccountPage />} />
            <Route path={AppRoutes.Checkout("")}>
                <Route path={AppRoutes.Checkout("success")} element={<CheckoutSuccessPage />} />
                <Route path={AppRoutes.Checkout("cancelled")} element={<CheckoutCancelledPage />} />
            </Route>
            <Route path={AppRoutes.Order()} element={<OrderPage />} />
        </Routes>
        <LoginModal />
        <ResetPasswordModal />
    </>;
};

export default App;
