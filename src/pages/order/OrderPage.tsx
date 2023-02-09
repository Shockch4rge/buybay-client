import { Container, Heading, VStack } from "@chakra-ui/react";
import { BackButton } from "../common/BackButton";
import { Product } from "../../util/models/Product";
import { ProductCard } from "../cart/components/ProductCard";
import { useGetOrderQuery } from "../../app/api/orders";
import { useParams } from "react-router-dom";

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

    // sorts a pair of (or more) products randomly if they have the same count
    return Array.from(map.values());
};

export const OrderPage: React.FC = () => {
    const { id } = useParams();
    const { data: order } = useGetOrderQuery(id!);

    if (!order) return <></>;

    return <>
        <Container maxW={"5xl"}>
            <BackButton />
            <Heading>Order Information</Heading>
            <VStack>
                {collapseDuplicates(order.products).map(i =>
                    <ProductCard key={i.product.id} product={i.product} quantity={i.count} />,
                )}
            </VStack>
        </Container>
    </>;
};