export const AppRoutes = {
    Landing: "/",
    Home: "/home",
    Cart: "/cart",
    Product: (id = ":id") => `/product/${id}`,
    SellProduct: "/sell-product",
    EditProduct: (id = ":id") => `/edit-product/${id}`,
    Registration: "/register",
    Account: "/account",
    Order: (id = ":id") => `/order/${id}`,
    Checkout: (path: "" | "cancelled" | "success") => `/checkout/${path}`,
} as const;