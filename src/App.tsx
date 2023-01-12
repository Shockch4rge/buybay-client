import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";
import { CartPage } from "./pages/cart/CartPage";
import { AppRoutes } from "./util/routes";
import { ProductPage } from "./pages/product/ProductPage";

const App: React.FC = () => {
    const router = createBrowserRouter([
        {
            path: AppRoutes.Home,
            caseSensitive: true,
            element: <HomePage />,
        },
        {
            path: AppRoutes.Cart,
            caseSensitive: true,
            element: <CartPage />,
        },
        {
            path: AppRoutes.Product(":id"),
            caseSensitive: true,
            element: <ProductPage />,
        },
    ]);

    return <RouterProvider router={router} />;
};

export default App;
