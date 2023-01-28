export const AppRoutes = {
    Home: "/",
    Cart: "/cart",
    Product: (id: string) => `/product/${id}`,
    SellProduct: "/sell-product",
    EditProduct: (id: string) => `/edit-product/${id}`,
    Registration: "/register",
    Account: "/account",
} as const;