import { Product } from "./models/Product";
import { ProductReview } from "./models/ProductReview";

export const mockProduct: Product = {
    id: "product1",
    sellerId: "user2",
    name: "Tissue Paper",
    description: "This is a really good roll of toilet paper. Might I even say - the best. It has so much pulpiness, and feels smooth and stable and silky on your skin.",
    price: 13.50,
    thumbnailUrl: "https://bit.ly/dan-abramov",
    imageUrls: [
        "https://alley.tv/wp-content/uploads/2016/11/lh_0000_Background.jpg",
        "https://i.scdn.co/image/ab6761610000e5eb45c0f559e90489af64359a59",
        "https://i.ytimg.com/vi/wMulm-gnCLs/maxresdefault.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/1/1a/Lisa_Hannigan_10_16_2017_-24_%2837889906544%29.jpg",
    ],
    quantity: 0,
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
    averageRating: 3.5,
    categories: ["Category 1", "Category 2"],
};

export const mockReview: ProductReview = {
    id: "1",
    productId: "product1",
    title: "Great product",
    content: "I really like this product. It's great!",
    authorId: "user1",
    rating: 4,
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
};