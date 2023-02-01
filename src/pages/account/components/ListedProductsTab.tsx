import {
    Button,
    Card,
    CardBody,
    Heading,
    Hide,
    HStack,
    Image,
    Stack,
    Stat,
    StatHelpText,
    StatNumber,
    TabPanel,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useLazyGetUserProductsQuery } from "../../../app/api/products";
import { useAuth } from "../../../app/context/AuthContext";
import { Product } from "../../../util/models/Product";
import { AppRoutes } from "../../../util/routes";
import { useNavigate } from "react-router-dom";
import { EmptyContent } from "../../common/EmptyContent";
import { useEffect } from "react";


export const ListedProductsTab: React.FC = () => {
    const { user } = useAuth();
    const [getUserProducts, { data: products }] = useLazyGetUserProductsQuery();

    useEffect(() => {
        if (!user) return;

        getUserProducts(user.id).unwrap()
            .then();
    }, [user]);

    return <TabPanel>
        <Heading size={"md"} mb={"8"}>Your Listed Products</Heading>
        {products &&
            (products.length === 0
                ?
                <EmptyContent>
                    <Heading size={"sm"}>You haven&apos;t listed any products!</Heading>
                </EmptyContent>
                :
                <VStack spacing={"4"}>
                    {products.map(p => <ProductCard key={`product-card-${p.id}`} product={p} />)}
                </VStack>
            )
        }
    </TabPanel>;
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const navigate = useNavigate();

    return <Card
        w={"full"}
        direction={"row"}
        variant={"outline"}
        borderRadius={"lg"}
        borderColor={"gray.200"}
        overflow={"hidden"}
        _hover={{
            borderColor: "gray.400",
        }}
        bg={"white"}
        transition={"border 0.2s ease-out"}
    >
        <Image fit={"cover"} boxSize={"48"} src={product.images.find(i => i.isThumbnail)!.url} />
        <CardBody px={"8"} display={"flex"} gap={"8"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack mt={"2"} spacing={"3"}>
                <HStack align={"center"} spacing={"2"}>
                    <Heading size={{ base: "sm", md: "md" }}>{product.name}</Heading>
                </HStack>
                <Hide below={"lg"}>
                    <Text>{product.description}</Text>
                </Hide>
                <Stat mt={"4"}>
                    <StatNumber>${product.price.toFixed(2)}</StatNumber>
                    <StatHelpText>Stock: {product.quantity}</StatHelpText>
                </Stat>
            </Stack>
            <Button size={{ md: "sm", lg: "md" }} onClick={() => navigate(AppRoutes.Product(product.id))}>View Product</Button>
        </CardBody>
    </Card>;
};