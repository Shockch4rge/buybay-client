import { Card, CardBody, Heading, Skeleton, Stack, TabPanel, VStack } from "@chakra-ui/react";
import { useLazyGetUserSalesQuery } from "../../../app/api/orders";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../app/context/AuthContext";
import { Order } from "../../../util/models/Order";
import { useNavigate } from "react-router-dom";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(LineElement, BarElement, Tooltip, CategoryScale, LinearScale, PointElement, Legend);

const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const chartOptions: ChartOptions<"bar" | "line"> = {
    scales: {
        A: {
            type: "linear",
            position: "left",
            title: {
                display: true,
                text: "Sales",
            },
        },
        B: {
            grid: {
                display: false,
            },
            title: {
                display: true,
                text: "Revenue",
            },
            ticks: {
                callback: value => `$${value}`,
            },
            type: "linear",
            position: "right",
            beginAtZero: true,
        },
    },
};

export const SalesTab: React.FC = () => {
    const { user } = useAuth();
    const [revenue, setRevenue] = useState<number[]>([]);
    const [getUserSales, { data: sales, isLoading: isLoadingSales }] = useLazyGetUserSalesQuery();

    const salesInMonth = useCallback(async (month: number) => {
        if (!user) return [];

        const sales = await getUserSales(user.id).unwrap();
        return sales.filter(sale => new Date(sale.createdAt).getMonth() === month);
    }, []);

    const revenueFromSales = useCallback(async (sales: Order[]) => {
        return sales.reduce((acc, sale, i) => acc + sale.products.length * sale.products[i].price, 0);
    }, []);

    useEffect(() => {
        if (!user) return;

        for (const month of months) {
            salesInMonth(month).then(sales => {
                revenueFromSales(sales).then(revenue => {
                    setRevenue(prev => [...prev, revenue]);
                });
            });
        }
    }, [user]);

    if (!sales || isLoadingSales) {
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

    return <TabPanel>
        <Heading mb={"8"} size={"md"}>Your Sales</Heading>
        <Chart options={chartOptions} type={"bar"} data={{
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [
                {
                    type: "bar" as const,
                    label: "Sales",
                    yAxisID: "A",
                    data: months.map(m => sales.reduce((acc, s) => acc + Number(new Date(s.createdAt).getMonth() === m), 0)),
                    backgroundColor: "rgba(0,183,101,0.53)",
                    // borderColor: "rgba(0,183,85,0.79)",
                },
                {
                    type: "line" as const,
                    label: "Revenue",
                    yAxisID: "B",
                    borderDash: [3, 3],
                    data: revenue,
                    tension: 0,
                    fill: false,
                    // backgroundColor: "rgba(198,246,213,0.31)",
                    borderColor: "#008cff",
                },
            ],
        }} />
        <VStack spacing={"4"}>
            {sales
                ? sales.map(o => <SaleCard key={`sale-card-${o.id}`} order={o} />)
                : <>
                    <SaleCardSkeleton />
                    <SaleCardSkeleton />
                    <SaleCardSkeleton />
                </>
            }
        </VStack>
    </TabPanel>;
};

const SaleCard: React.FC<{ order: Order }> = ({ order }) => {
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
            Hello
        </CardBody>
    </Card>;
};

const SaleCardSkeleton = () => {
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