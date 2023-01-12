export const AppRoutes = {
    Home: "/",
    Cart: "/cart",
    Product: (id: string) => `/product/${id}`,
} as const;