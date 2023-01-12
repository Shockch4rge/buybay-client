import { Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { ProductCard } from "./components/ProductCard";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { mockProduct } from "../../util/mocks";
import { Footer } from "../common/Footer";


export const CartPage: React.FC = () => {
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
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <ProductCard product={mockProduct} />
                <Button h={"16"} rightIcon={<FaArrowRight />}>
                    Add more items
                </Button>
            </VStack>
        </Container>
        <Footer/>
    </>;

};