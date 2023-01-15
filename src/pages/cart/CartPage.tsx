import { Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { ProductCard } from "./components/ProductCard";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { Footer } from "../common/Footer";
import { Product } from "../../util/models/Product";
import { useAppSelector } from "../../app/store/hooks";

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

export const CartPage: React.FC = () => {
    const items = useAppSelector(state => state.cart.items);

    return <>
        <Container maxW={{ md: "3xl", lg: "5xl", xl: "6xl" }}>
            <VStack my={"12"} align={"start"} spacing={"4"}>
                <HStack spacing={"4"}>
                    <FaShoppingCart size={"1.8em"} />
                    <Heading>Cart</Heading>
                </HStack>
                <Text fontSize={"1.4em"}>
                    {items.length} items &bull; ${items.reduce((a, b) => a + b.price, 0).toFixed(2)}
                </Text>
            </VStack>
            <VStack spacing={"4"} align={"stretch"}>
                {items.length === 0
                    ? <Text>Your cart is empty.</Text>
                    : collapseDuplicates(items).map((item, i) =>
                        <ProductCard key={`cart-product-${i}`} product={item.product} cartQuantity={item.count} />,
                    )
                }
                <Button h={"16"} rightIcon={<FaArrowRight />}>
                    Add more items
                </Button>
            </VStack>
        </Container>
        <Footer/>
    </>;

};