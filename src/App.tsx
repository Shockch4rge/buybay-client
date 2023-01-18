import { Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";
import { CartPage } from "./pages/cart/CartPage";
import { AppRoutes } from "./util/routes";
import { ProductPage } from "./pages/product/ProductPage";
import { useAuth } from "./app/context/AuthContext";
import React, { useEffect } from "react";
import { useLazyGetCurrentUserQuery } from "./app/api/auth";
import { LoginModal } from "./pages/common/LoginModal";
import { RegisterModal } from "./pages/common/RegisterModal";
import { ResetPasswordModal } from "./pages/common/ResetPasswordModal";
import { SellProductPage } from "./pages/sell-product/SellProductPage";
import { RegistrationPage } from "./pages/registration/RegistrationPage";

const App: React.FC = () => {
    const { token } = useAuth();
    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        if (!token) return;

        getCurrentUser().unwrap();
    }, []);

    return <>
        <Routes>
            <Route index element={<HomePage/>}/>
            <Route path={AppRoutes.Cart} element={<CartPage />} />
            <Route path={AppRoutes.Product(":id")} element={<ProductPage />} />
            <Route path={AppRoutes.SellProduct} element={<SellProductPage />} />
            <Route path={AppRoutes.Registration} element={<RegistrationPage />} />
        </Routes>
        <LoginModal />
        <RegisterModal />
        <ResetPasswordModal />
    </>;
};

export default App;
