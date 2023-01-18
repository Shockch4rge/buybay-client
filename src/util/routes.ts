export const AppRoutes = {
    Home: "/",
    Cart: "/cart",
    Product: (id: string) => `/product/${id}`,
    SellProduct: "/sell-product",
    Registration: "/register",
    Account: "/account",
} as const;