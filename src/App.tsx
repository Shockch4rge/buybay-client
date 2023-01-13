import { Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";
import { CartPage } from "./pages/cart/CartPage";
import { AppRoutes } from "./util/routes";
import { ProductPage } from "./pages/product/ProductPage";
import { useAuth } from "./app/context/AuthContext";
import { useEffect } from "react";
import { useLazyGetCurrentUserQuery } from "./app/api/auth";

const App: React.FC = () => {
    const { token } = useAuth();
    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        if (!token) return;

        getCurrentUser().unwrap();
    }, []);

    return <Routes>
        <Route index element={<HomePage/>}/>
        <Route path={AppRoutes.Cart} element={<CartPage />} />
        <Route path={AppRoutes.Product(":id")} element={<ProductPage />} />
    </Routes>;
};

export default App;
