import { useGetAllCategoriesQuery, useLazyGetCategoryProductsQuery } from "../../app/api/products";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/store/hooks";
import {
    AspectRatio,
    Button,
    ButtonGroup,
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
    VStack,
} from "@chakra-ui/react";
import { SearchBar } from "./components/SearchBar";
import { NavBar } from "../common/NavBar";
import { Footer } from "../common/Footer";
import { useCallback } from "react";
import Utils from "../../util/Utils";
import { AppRoutes } from "../../util/routes";
import { cartAdd } from "../../app/store/slices/cart";

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data: categories } = useGetAllCategoriesQuery({
        limit: 25,
    });

    const [getCategoryProducts, { data: products }] = useLazyGetCategoryProductsQuery();

    const debounced = useCallback(
        Utils.debounce((values: string[]) => {
            getCategoryProducts({ limit: 25, categoryIds: values }).unwrap();
        }, 1000),
        [],
    );

    if (!categories) return <></>;

    return <>
        <NavBar />
        <Container maxW={"8xl"}>
            <SearchBar />
            <Grid templateRows={"repeat(4, 1fr)"} templateColumns={"repeat(4, 1fr)"} gap={"8"}>
                <GridItem p={"6"} rowSpan={4} colSpan={1} borderRadius={"8"} bg={"gray.50"}>
                    <Heading size={"md"}>Categories</Heading>
                    <VStack mt={"6"} align={"start"} spacing={"4"}>
                        <CheckboxGroup onChange={debounced}>
                            {categories.map(category =>
                                <Checkbox key={category.id} colorScheme={"cyan"} size={"lg"} value={category.id}>
                                    {category.name}
                                </Checkbox>,
                            )}
                        </CheckboxGroup>
                    </VStack>
                </GridItem>
                {products?.map((product, i) =>
                    <GridItem key={`recommended-product-${product.id}-${i}`} rowSpan={1} colSpan={1}>
                        <Card variant={"outline"}>
                            <CardBody>
                                <AspectRatio ratio={16/10}>
                                    <Image
                                        // src={product.images.find(i => i.isThumbnail)!.url}
                                        src={product.images[0].url}
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
                            <CardFooter display={"flex"} justifyContent={"end"}>
                                <ButtonGroup spacing='2'>
                                    <Button size={"sm"} variant={"primaryGhost"} onClick={() => navigate(AppRoutes.Product(product.id))}>
                                        View Details
                                    </Button>
                                    <Button size={"sm"} variant={"primary"} onClick={() => dispatch(cartAdd(product))}>
                                        Add to cart
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    </GridItem>,
                )}
            </Grid>
        </Container>
        <Footer />
    </>;
};
