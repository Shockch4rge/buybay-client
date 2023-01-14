import { Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { ProductCard } from "./components/ProductCard";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { mockProduct1, mockProduct2 } from "../../util/mocks";
import { Footer } from "../common/Footer";
import { Product } from "../../util/models/Product";

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

    return Array.from(map.values());
};

export const CartPage: React.FC = () => {
    const items = collapseDuplicates(Array<Product>(10).fill(mockProduct1, 0, 6)
        .fill(mockProduct2, 6));

    return <>
        <Container maxW={{ md: "3xl", lg: "5xl", xl: "6xl" }}>
            <VStack my={"12"} align={"start"} spacing={"4"}>
                <HStack spacing={"4"}>
                    <FaShoppingCart size={"1.8em"} />
                    <Heading>Cart</Heading>
                </HStack>
                <Text fontSize={"1.4em"}>4 items &bull; ${123.50.toFixed(2)}</Text>
            </VStack>
            <VStack spacing={"4"} align={"stretch"}>
                {items.length === 0
                    ? <Text>Your cart is empty.</Text>
                    : items.map((item, i) =>
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