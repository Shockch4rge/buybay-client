import {
    Box,
    Button,
    Container,
    Divider,
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
import { ProductImageGrid } from "./components/ProductImageGrid";
import { FaMinus, FaPlus, FaShoppingCart, FaStar } from "react-icons/fa";
import { useState } from "react";
import { ReviewCard, SessionUserReviewCard } from "./components/ReviewCard";
import { NavBar } from "../common/NavBar";
import { useDispatch } from "react-redux";
import { cartAdd } from "../../app/store/slices/cart";
import { useGetProductQuery } from "../../app/api/products";
import { useNavigate, useParams } from "react-router-dom";
import { openModal } from "../../app/store/slices/ui/modals";
import { CreateReviewModal } from "./components/CreateReviewModal";
import { Footer } from "../common/Footer";
import { useGetProductReviewsQuery } from "../../app/api/productReviews";
import { BackButton } from "../common/BackButton";
import { useAuth } from "../../app/context/AuthContext";
import { EmptyContent } from "../common/EmptyContent";
import { EditReviewModal } from "./components/EditReviewModal";
import { AppRoutes } from "../../util/routes";

export const ProductPage: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cartQuantity, setCartQuantity] = useState(1);
    const { data: product } = useGetProductQuery(id!);
    const { data: reviews } = useGetProductReviewsQuery(id!);

    if (!product || !reviews) return <></>;

    const isOwnProduct = user?.id === product.sellerId;
    const hasWrittenReview = reviews.some(r => r.authorId === user?.id);
    const ownReview = reviews.find(r => r.authorId === user?.id);

    return <>
        <NavBar />
        <Container maxW={{ md: "3xl", lg: "5xl", xl: "8xl" }}>
            <BackButton />
            <Box mt={"12"}>
                <Heading>Product Information</Heading>
                <Flex mt={"8"} p={"4"} direction={{ base: "column-reverse", lg: "row" }} gap={"8"} borderWidth={"thin"} borderRadius={"lg"}>
                    <ProductImageGrid urls={product.images.map(i => i.url)} />
                    <Box flex={"1"} pos={"relative"}>
                        <Heading>{product.name}</Heading>
                        {reviews && <HStack mt={"4"}>
                            {Array.from({ length: 5 }, (_, i) => i + 1)
                                .map((_, i) =>
                                    <Text
                                        key={`product-review-rating-${i}`}
                                        fontSize={"xl"}
                                        color={i < reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length ?? 0 ? "green.300" : "gray.400"}>
                                        <FaStar />
                                    </Text>,
                                )}
                        </HStack>}
                        <Wrap my={"6"}>
                            {product.categories.map((c, i) =>
                                <WrapItem key={`product-${product.id}-tag-${i}`}>
                                    <Link>
                                        <Tag _hover={{ bg: "gray.200" }}>
                                            <TagLabel>{c.name}</TagLabel>
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
                        <Text mt={"12"}>
                            Added on {new Date(product.createdAt).toLocaleDateString()}
                        </Text>

                        {product.sellerId !== user?.id
                            ?
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
                                                title: `Added ${cartQuantity} items to cart!`,
                                                duration: 2000,
                                            });
                                        }}>
                                        Add to Cart
                                    </Button>
                                    : <Button disabled>
                                        Sold Out
                                    </Button>
                                }
                            </HStack>
                            :
                            <HStack pos={"absolute"} bottom={"8"} right={"8"} spacing={"6"}>
                                <Button variant={"primary"} onClick={() => navigate(AppRoutes.EditProduct(product.id))}>
                                    Edit Details
                                </Button>
                            </HStack>
                        }
                    </Box>
                </Flex>
            </Box>

            <VStack align={"start"} spacing={"8"}>
                <Heading mt={"24"}>Reviews ({reviews.length})</Heading>
                {/* TODO: add back disabled flag */}
                {/*<Button onClick={() => dispatch(openModal("createReview"))} disabled={isOwnProduct || hasWrittenReview}>*/}
                {/*    {isOwnProduct*/}
                {/*        ? "You can't write a review for your own product."*/}
                {/*        : hasWrittenReview*/}
                {/*            ? "You've already reviewed this product."*/}
                {/*            : "Write a review"}*/}
                {/*</Button>*/}
                {ownReview &&
                    <VStack w={"full"} my={"20"} align={"start"} spacing={"8"}>
                        <Heading size={"md"}>Your Review</Heading>
                        <SessionUserReviewCard review={ownReview} />
                    </VStack>
                }
                {!ownReview
                    ? <Button onClick={() => dispatch(openModal("createReview"))}>
                        Write a review
                    </Button>
                    : <Divider w={"full"} />
                }
                {reviews.length === 0
                    ?
                    <EmptyContent>
                        There are no reviews for this product yet!
                    </EmptyContent>
                    :
                    <VStack w={"full"} spacing={"8"}>
                        {reviews.filter(r => r.authorId !== user?.id).map(r =>
                            <ReviewCard key={`product-${product.id}-review-${r.id}`} review={r} />,
                        )}
                        {/*{reviews.map(r =>*/}
                        {/*    <ReviewCard key={`product-${product.id}-review-${r.id}`} review={r} />,*/}
                        {/*)}*/}
                    </VStack>
                }
            </VStack>
        </Container>
        <Footer/>
        <CreateReviewModal product={product}/>
        {ownReview && <EditReviewModal review={ownReview} />}
    </>;
};