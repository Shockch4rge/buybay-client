import {
    Button,
    Card,
    CardBody,
    Heading,
    Hide,
    HStack,
    IconButton,
    Image,
    Stack,
    Stat,
    StatNumber,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { Product } from "../../../util/models/Product";
import { useAppDispatch } from "../../../app/store/hooks";
import { FaMinus, FaPlus } from "react-icons/fa";
import { cartAdd, cartRemove } from "../../../app/store/slices/cart";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../util/routes";

interface Props {
    product: Product;
    cartQuantity: number;
}

export const ProductCard: React.FC<Props> = ({ product, cartQuantity }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    return <Card
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
        <Image fit={"cover"} boxSize={"xs"} src={product.thumbnailUrl} />
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
                </Stat>
            </Stack>
            <VStack align={"stretch"} spacing={{ md: "4", lg: "8" }}>
                <Button size={{ md: "sm", lg: "md" }} onClick={() => navigate(AppRoutes.Product(product.id))}>View Product</Button>
                <HStack spacing={"4"}>
                    <IconButton
                        variant={"ghost"}
                        aria-label={"Decrease Quantity"}
                        icon={<FaMinus/>}
                        disabled={cartQuantity <= 1}
                        onClick={() => {
                            dispatch(cartRemove(product));
                        }}
                    />
                    <Heading size={"md"}>{cartQuantity}</Heading>
                    <IconButton
                        variant={"ghost"}
                        aria-label={"Increase Quantity"}
                        icon={<FaPlus/>}
                        disabled={cartQuantity >= product.quantity}
                        onClick={() => {
                            dispatch(cartAdd(product));
                        }}
                    />
                    <Text fontSize={"lg"}>${(product.price * cartQuantity).toFixed(2)}</Text>
                </HStack>
            </VStack>
        </CardBody>
    </Card>;
};