import { FaArrowRight, FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";

import { useAppSelector } from "../../app/store/hooks";
import { Product, ProductJSON } from "../../util/models/Product";
import { AppRoutes } from "../../util/routes";
import { EmptyContent } from "../common/EmptyContent";
import { Footer } from "../common/Footer";
import { ProductCard } from "./components/ProductCard";
import { NavBar } from "../common/NavBar";
import { BackButton } from "../common/BackButton";
import { useCheckoutMutation } from "../../app/api/orders";
import { useAuth } from "../../app/context/AuthContext";

const collapseDuplicates = (products: Product[]) => {
    const map = new Map<string, { product: Product; count: number }>();

    for (const p of products) {
        const existing = map.get(p.id);

        if (existing) {
            map.set(p.id, { product: p, count: existing.count + 1 });
            continue;
        }

        map.set(p.id, { product: p, count: 1 });
    }

    // sorts a pair of (or more) products randomly if they have the same count
    return Array.from(map.values());
};

const mapToOrder = (products: Product[]) => {
    const map = new Map<string, ProductJSON & { purchased_quantity: number }>();

    for (const p of products) {
        const existing = map.get(p.id);

        if (existing) {
            map.set(p.id, {
                ...existing,
                purchased_quantity: existing.purchased_quantity + 1,
            });
            continue;
        }

        map.set(p.id, {
            id: p.id,
            seller_id: p.sellerId,
            name: p.name,
            description: p.description,
            price: p.price,
            quantity: p.quantity,
            images: p.images,
            created_at: p.createdAt,
            updated_at: p.updatedAt,
            categories: p.categories,
            purchased_quantity: 1,
        });
    }

    return Array.from(map.values());
};

export const CartPage: React.FC = () => {
    const { user } = useAuth();
    const history = useLocation();
    const navigate = useNavigate();
    const [checkout] = useCheckoutMutation();
    const cart = useAppSelector(state => state.cart.items);

    if (!user) return <></>;

    const handleCheckout = async () => {
        const result = await checkout({
            buyer_id: user.id,
            products: mapToOrder(cart),
        }).unwrap();

        window.location.href = result.url;
    };

    return <>
        <NavBar />
        <Container maxW={{ md: "3xl", lg: "5xl", xl: "6xl" }}>
            <BackButton />
            <HStack w={"full"} justify={"space-between"}>
                <VStack my={"12"} align={"start"} spacing={"4"}>
                    <HStack spacing={"4"}>
                        <FaShoppingCart size={"1.8em"} />
                        <Heading>Cart</Heading>
                    </HStack>
                    <Text fontSize={"1.4em"}>
                        {cart.length} items &bull; ${cart.reduce((a, b) => a + b.price, 0).toFixed(2)}
                    </Text>
                </VStack>
                <Button
                    variant={"primary"}
                    disabled={cart.length === 0}
                    leftIcon={<FaCheckCircle />}
                    onClick={handleCheckout}
                >
                    Checkout
                </Button>
            </HStack>
            <VStack spacing={"4"} align={"stretch"}>
                {cart.length === 0
                    ? <EmptyContent>Your cart is empty!</EmptyContent>
                    : collapseDuplicates(cart).map((item, i) =>
                        <ProductCard key={`cart-product-${i}`} product={item.product} quantity={item.count}/>,
                    )
                }
                <Button h={"16"} rightIcon={<FaArrowRight />} onClick={() => navigate(AppRoutes.Home)}>
                    Add more items
                </Button>
            </VStack>
        </Container>
        <Footer/>
    </>;

};