import { useGetAllCategoriesQuery, useLazyGetCategoryProductsQuery } from "../../app/api/products";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
    AspectRatio,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Checkbox,
    CheckboxGroup,
    Container,
    Divider,
    Grid,
    GridItem,
    Heading,
    HStack,
    Image,
    Stack,
    Text,
    useCheckboxGroup,
    VStack,
} from "@chakra-ui/react";
import { SearchBar } from "./components/SearchBar";
import { NavBar } from "../common/NavBar";
import { Footer } from "../common/Footer";
import { useCallback, useEffect } from "react";
import Utils from "../../util/Utils";
import { AppRoutes } from "../../util/routes";

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cart = useAppSelector(state => state.cart.items);
    const { value: selectedCategories, getCheckboxProps } = useCheckboxGroup();

    const { data: categories } = useGetAllCategoriesQuery({ limit: 25 });
    const [getCategoryProducts, { data: products, isLoading }] = useLazyGetCategoryProductsQuery();

    const debounced = useCallback(
        Utils.debounce((categoryIds: string[]) => {
            getCategoryProducts({ limit: 25, categoryIds }).unwrap();
        }, 1000),
        [],
    );

    useEffect(() => {
        getCategoryProducts({ limit: 25, categoryIds: [] }).unwrap();
    }, []);

    if (!categories) return <></>;

    return <>
        <NavBar />
        <Container maxW={"8xl"}>
            <SearchBar />
            <Heading>
                Returning products under {selectedCategories.length} {" "}
                {selectedCategories.length === 1 ? "category" : "categories"}
            </Heading>
            <Grid mt={"6"} templateRows={"repeat(4, 1fr)"} templateColumns={"repeat(4, 1fr)"} gap={"8"}>
                <GridItem p={"6"} rowSpan={4} colSpan={1} borderRadius={"8"} bg={"gray.50"}>
                    <Heading size={"md"}>Categories</Heading>
                    <VStack mt={"6"} align={"start"} spacing={"4"}>
                        <CheckboxGroup onChange={debounced}>
                            {categories.map(category =>
                                <Checkbox {...getCheckboxProps()} key={category.id} colorScheme={"cyan"} size={"lg"} value={category.id}>
                                    {category.name}
                                </Checkbox>,
                            )}
                        </CheckboxGroup>
                    </VStack>
                </GridItem>
                {isLoading
                    ?
                    <GridItem rowSpan={4} colSpan={3} display={"grid"} placeItems={"center"}>
                        <Box>Loading products...</Box>
                    </GridItem>
                    :
                    products?.map((product, i) =>
                        <GridItem key={`recommended-product-${product.id}-${i}`} rowSpan={1} colSpan={1}>
                            <Card variant={"outline"}>
                                <CardBody>
                                    <AspectRatio ratio={16/10}>
                                        <Image
                                        // src={product.images.find(i => i.isThumbnail)!.url}
                                            src={product.images[0]?.url ?? "https://i.scdn.co/image/ab6761610000e5eb45c0f559e90489af64359a59"}
                                            alt='Green double couch with wooden legs'
                                            borderRadius='lg'
                                        />
                                    </AspectRatio>
                                    <Stack mt='6' spacing='3'>
                                        <Heading size='md'>{product.name}</Heading>
                                        <Text noOfLines={3}>
                                            {product.description}
                                        </Text>
                                        <HStack spacing={"2"}>
                                            <Text color='green.500' fontSize='2xl'>
                                            ${product.price.toFixed(2)}
                                            </Text>
                                            <Text>&bull; {product.quantity} left</Text>
                                        </HStack>
                                    </Stack>
                                </CardBody>
                                <Divider />
                                <CardFooter display={"flex"} justifyContent={"space-between"}>
                                    {cart.find(p => p.id === product.id) &&
                                    <Button variant={"link"} onClick={() => navigate(AppRoutes.Cart)}>
                                        {cart.filter(p => p.id === product.id).length} in cart
                                    </Button>
                                    }
                                    <Button size={"sm"} variant={"primaryGhost"} onClick={() => navigate(AppRoutes.Product(product.id))}>
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        </GridItem>,
                    )}
            </Grid>
        </Container>
        <Footer />
    </>;
};
