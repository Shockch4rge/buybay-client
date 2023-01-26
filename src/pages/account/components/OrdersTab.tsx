import { useAuth } from "../../../app/context/AuthContext";
import { useLazyGetUserOrdersQuery } from "../../../app/api/orders";
import { useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    Center,
    Heading,
    Hide,
    Image,
    Skeleton,
    Stack,
    Stat,
    StatNumber,
    TabPanel,
    Text,
    VStack,
} from "@chakra-ui/react";
import { AppRoutes } from "../../../util/routes";
import { Order } from "../../../util/models/Order";
import { useGetProductQuery } from "../../../app/api/products";
import { useNavigate } from "react-router-dom";
import { EmptyContent } from "../../common/EmptyContent";

export const OrdersTab: React.FC = () => {
    const { user } = useAuth();
    const [getUserOrders, { data: orders, isLoading: isLoadingOrders }] = useLazyGetUserOrdersQuery();

    useEffect(() => {
        if (!user) return;

        getUserOrders(user.id)
            .unwrap()
            .then();
    }, [user]);

    if (!user) return <></>;

    return <TabPanel>
        <Heading size={"md"}>Your Orders</Heading>

        {isLoadingOrders &&
            <Center w={"full"}>
                Loading orders...
            </Center>
        }
        {orders &&
            (orders.length === 0 
                ?
                <EmptyContent mt={"8"}>
                    <Heading size={"sm"}>You haven&apos;t made any orders!</Heading>
                </EmptyContent>
                :
                <VStack spacing={"4"}>
                    {orders.map(o => <OrderCard key={`order-card-${o.id}`} order={o} />)}
                </VStack>
            )
        }
    </TabPanel>;
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const navigate = useNavigate();
    const { data: product, isLoading: isLoadingProduct } = useGetProductQuery(order.productId);

    if (!product || isLoadingProduct) {
        return <Card h={"8em"} direction={"row"} variant={"outline"} bg={"white"} borderRadius={"lg"}>
            <Skeleton h={"8em"} w={"8em"}/>
            <CardBody>
                <Stack mt={"2"} spacing={"4"}>
                    <Skeleton h={"1em"} w={"12em"}/>
                    <Skeleton h={"1em"} w={"24em"}/>
                </Stack>
            </CardBody>
        </Card>;
    }

    return <Card
        bg={"white"}
        h={{ base: "5em", md: "8em", lg: "unset" }}
        direction={"row"}
        variant={"outline"}
        borderRadius={"lg"}
        borderColor={"gray.200"}
        overflow={"hidden"}
        _hover={{
            borderColor: "gray.400",
        }}
        transition={"border 0.2s ease-out"}
    >
        <Image fit={"cover"} boxSize={"xs"} src={product.images.find(i => i.isThumbnail)!.url} />
        <CardBody px={"8"} display={"flex"} gap={"8"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack mt={"2"} spacing={"3"}>
                <Heading size={{ base: "sm", md: "md" }}>{product.name}</Heading>
                <Hide below={"lg"}>
                    <Text>{product.description}</Text>
                </Hide>
                <Stat mt={"4"}>
                    <StatNumber>${product.price.toFixed(2)}</StatNumber>
                </Stat>
            </Stack>
            <VStack align={"stretch"} spacing={{ md: "4", lg: "8" }}>
                <Button
                    size={{ md: "sm", lg: "md" }}
                    onClick={() => navigate(AppRoutes.Product(product.id))}
                >
                    View
                </Button>
            </VStack>
        </CardBody>
    </Card>;
};