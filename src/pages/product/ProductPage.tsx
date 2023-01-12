import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    IconButton,
    Link,
    Tag,
    TagLabel,
    Text,
    useToast,
    VStack,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { mockProduct, mockReview } from "../../util/mocks";
import { ProductImageGrid } from "./components/ProductImageGrid";
import { FaMinus, FaPlus, FaShoppingCart, FaStar } from "react-icons/fa";
import { useState } from "react";
import { ReviewCard } from "./components/ReviewCard";
import { NavBar } from "../common/NavBar";
import { useDispatch } from "react-redux";
import { cartAdd } from "../../app/store/slices/cart";

export const ProductPage: React.FC = () => {
    // const { id } = useParams();
    const product = mockProduct;
    const reviews = Array(5).fill(mockReview);
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const toast = useToast();
    const dispatch = useDispatch();
    const [cartQuantity, setCartQuantity] = useState(product.quantity === 0 ? 0 : 1);

    return <>
        <NavBar />
        <Container py={"24"} maxW={{ md: "3xl", lg: "5xl", xl: "8xl" }}>
            <Box>
                <Heading>Product Information</Heading>
                <Flex mt={"8"} p={"4"} direction={{ base: "column-reverse", lg: "row" }} gap={"8"} borderWidth={"thin"} borderRadius={"lg"}>
                    <ProductImageGrid urls={product.imageUrls} />
                    <Box flex={"1"} pos={"relative"}>
                        <Heading>
                            {product.name}
                        </Heading>
                        <HStack mt={"4"}>
                            {Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) =>
                                <Text key={i} fontSize={"xl"} color={i < averageRating ? "green.300" : "gray.400"}>
                                    <FaStar/>
                                </Text>,
                            )}
                        </HStack>
                        <Wrap my={"6"}>
                            {product.categories.map((c, i) =>
                                <WrapItem key={`product-${product.id}-tag-${i}`}>
                                    <Link>
                                        <Tag _hover={{ bg: "gray.200" }}>
                                            <TagLabel>{c}</TagLabel>
                                        </Tag>
                                    </Link>
                                </WrapItem>,
                            )}
                        </Wrap>
                        <Text mt={"8"} fontSize={"lg"} fontWeight={"bold"}>
                        Description:
                        </Text>
                        <Text fontSize={"lg"}>
                            {product.description}
                        </Text>

                        <Heading mt={"8"}>${product.price.toFixed(2)}</Heading>
                        {product.quantity > 0
                            ? <Text>{product.quantity} left in stock</Text>
                            : <Text color={"red.500"}>Out of stock</Text>
                        }
                        <Text mt={"12"} fontStyle={"italic"}>
                            Added on {new Date(product.createdAt).toLocaleDateString()}
                        </Text>

                        <HStack pos={"absolute"} bottom={"8"} right={"8"} spacing={"6"}>
                            <Text fontSize={"lg"} fontWeight={"bold"}>Quantity:</Text>
                            <HStack spacing={"4"}>
                                <IconButton
                                    variant={"ghost"}
                                    aria-label={"Decrease Quantity"}
                                    icon={<FaMinus/>}
                                    disabled={cartQuantity <= 1}
                                    onClick={() => setCartQuantity(q => q - 1)}
                                />
                                <Heading size={"md"}>{cartQuantity}</Heading>
                                <IconButton
                                    variant={"ghost"}
                                    aria-label={"Increase Quantity"}
                                    icon={<FaPlus/>}
                                    disabled={cartQuantity >= product.quantity}
                                    onClick={() => setCartQuantity(q => q + 1)}
                                />
                            </HStack>
                            {product.quantity > 0
                                ? <Button
                                    variant={"primary"}
                                    leftIcon={<FaShoppingCart />}
                                    onClick={() => {
                                        dispatch(cartAdd(product));
                                        toast({
                                            title: "Added to cart!",
                                        });
                                    }}>
                                    Add to Cart
                                </Button>
                                : <Button disabled>
                                    Sold Out
                                </Button>
                            }
                        </HStack>
                    </Box>
                </Flex>
            </Box>

            <Box>
                <Heading mt={"24"}>Reviews (3)</Heading>
                <VStack mt={"8"} spacing={"8"}>
                    <ReviewCard review={mockReview}/>
                    <ReviewCard review={mockReview}/>
                    <ReviewCard review={mockReview}/>
                    <ReviewCard review={mockReview}/>
                    <ReviewCard review={mockReview}/>
                </VStack>
            </Box>
        </Container>
    </>;
};