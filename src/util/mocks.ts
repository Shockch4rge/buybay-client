import { Product } from "./models/Product";
import { ProductReview } from "./models/ProductReview";

export const mockProduct1: Product = {
    id: "product1",
    sellerId: "user2",
    name: "Tissue Paper",
    description: "This is a really good roll of toilet paper. Might I even say - the best. It has so much pulpiness, and feels smooth and stable and silky on your skin.",
    price: 13.50,
    images: [
        {
            productId: "product1",
            isThumbnail: true,
            url: "https://alley.tv/wp-content/uploads/2016/11/lh_0000_Background.jpg",
        },
        {
            productId: "product1",
            isThumbnail: false,
            url: "https://i.scdn.co/image/ab6761610000e5eb45c0f559e90489af64359a59",
        },
        {
            productId: "product1",
            isThumbnail: false,
            url: "https://i.ytimg.com/vi/wMulm-gnCLs/maxresdefault.jpg",
        },
        {
            productId: "product1",
            isThumbnail: false,
            url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Lisa_Hannigan_10_16_2017_-24_%2837889906544%29.jpg",
        },
    ],
    quantity: 6,
    createdAt: new Date("2021-01-01").toISOString(),
    updatedAt: new Date("2021-01-01").toISOString(),
    categories: [
        {
            id: "category1",
            productId: "product1",
            name: "Appliances",
        },
        {
            id: "category2",
            productId: "product1",
            name: "Kitchenware",
        },
        {
            id: "category3",
            productId: "product3",
            name: "Cheap",
        },
    ],
};

export const mockProduct2: Product = {
    id: "product2",
    sellerId: "user2",
    name: "Bowl",
    description: "This is a nice round bowl for serving food in.",
    price: 5.00,
    images: [
        {
            productId: "product2",
            isThumbnail: false,
            url: "https://alley.tv/wp-content/uploads/2016/11/lh_0000_Background.jpg",
        },
        {
            productId: "product2",
            isThumbnail: false,
            url: "https://i.scdn.co/image/ab6761610000e5eb45c0f559e90489af64359a59",
        },
        {
            productId: "product2",
            isThumbnail: false,
            url: "https://i.ytimg.com/vi/wMulm-gnCLs/maxresdefault.jpg",
        },
        {
            productId: "product2",
            isThumbnail: true,
            url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Lisa_Hannigan_10_16_2017_-24_%2837889906544%29.jpg",
        },
    ],
    quantity: 2,
    createdAt: new Date("2021-01-01").toISOString(),
    updatedAt: new Date("2021-01-01").toISOString(),
    categories: [
        {
            id: "category2",
            productId: "product2",
            name: "Kitchenware",
        },
        {
            id: "category4",
            productId: "product2",
            name: "Cutlery",
        },
    ],
};

export const mockReview: ProductReview = {
    id: "1",
    productId: "product1",
    title: "Great product",
    content: "I really like this product. It's great!",
    authorId: "user1",
    rating: 4,
    createdAt: new Date("2021-01-01").toISOString(),
    updatedAt: new Date("2021-01-01").toISOString(),
};