import { useAuth } from "../../../app/context/AuthContext";
import { useLazyGetUserOrdersQuery } from "../../../app/api/orders";
import { useEffect } from "react";
import {
    Card,
    CardBody,
    Center,
    Heading,
    Skeleton,
    Stack,
    Stat,
    StatHelpText,
    StatNumber,
    TabPanel,
    VStack,
} from "@chakra-ui/react";
import { Order } from "../../../util/models/Order";
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

        {orders?.length === 0
            ?
            <EmptyContent mt={"8"}>
                <Heading size={"sm"}>You haven&apos;t made any orders!</Heading>
            </EmptyContent>
            :
            <VStack spacing={"4"}>
                {orders
                    ? orders.map(o => <OrderCard key={`order-card-${o.id}`} order={o} />)
                    : <>
                        <OrderCardSkeleton />
                        <OrderCardSkeleton />
                        <OrderCardSkeleton />
                    </>
                }
            </VStack>
        }
    </TabPanel>;
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const navigate = useNavigate();

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
        <CardBody>
            <Stat>
                <StatNumber>
                    Amount: ${order.products.map(p => p.price).reduce((a, b) => a + b, 0).toFixed(2)}
                </StatNumber>
                <StatHelpText>
                    &bull; {new Date(order.createdAt).toTimeString()}
                </StatHelpText>
            </Stat>
        </CardBody>
    </Card>;
};

const OrderCardSkeleton = () => {
    return <Card h={"8em"} direction={"row"} variant={"outline"} bg={"white"} borderRadius={"lg"}>
        <Skeleton h={"8em"} w={"8em"}/>
        <CardBody>
            <Stack mt={"2"} spacing={"4"}>
                <Skeleton h={"1em"} w={"12em"}/>
                <Skeleton h={"1em"} w={"24em"}/>
            </Stack>
        </CardBody>
    </Card>;
};