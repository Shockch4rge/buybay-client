import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
    Button,
    Card,
    CardBody,
    Heading,
    Hide,
    HStack,
    IconButton,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Stack,
    Stat,
    StatNumber,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";

import { useAppDispatch } from "../../../app/store/hooks";
import { cartAdd, cartClear, cartRemove } from "../../../app/store/slices/cart";
import { Product } from "../../../util/models/Product";
import { AppRoutes } from "../../../util/routes";
import { FaTrash } from "react-icons/all";

interface Props {
    product: Product;
    quantity: number;
}

export const ProductCard: React.FC<Props> = ({ product, quantity}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    return (
        <Card
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
            <Image
                fit={"cover"}
                boxSize={"xs"}
                src={product.images.find(i => i.isThumbnail)?.url ?? product.images[0].url}
            />
            <CardBody
                px={"8"}
                display={"flex"}
                gap={"8"}
                justifyContent={"space-between"}
                alignItems={"center"}
                pos={"relative"}
            >
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
                    <Button
                        size={{ md: "sm", lg: "md" }}
                        onClick={() => navigate(AppRoutes.Product(product.id))}
                    >
                        View Product
                    </Button>
                    <HStack spacing={"4"}>
                        <IconButton
                            className={"decrement-cart-quantity"}
                            variant={"ghost"}
                            aria-label={"Decrease Quantity"}
                            icon={<FaMinus />}
                            disabled={quantity <= 1}
                            onClick={() => dispatch(cartRemove(product))}
                        />
                        <Heading size={"md"}>{quantity}</Heading>
                        <IconButton
                            variant={"ghost"}
                            aria-label={"Increase Quantity"}
                            icon={<FaPlus />}
                            disabled={quantity >= product.quantity}
                            onClick={() => dispatch(cartAdd({
                                product,
                                quantity: 1,
                            }))}
                        />
                        <Text fontSize={"lg"}>${(product.price * quantity).toFixed(2)}</Text>
                    </HStack>
                </VStack>
                <Popover>
                    {({ onClose }) => <>
                        <PopoverTrigger>
                            <IconButton className={"remove-from-cart"} aria-label={"Remove Product"} pos={"absolute"} top={"4"} right={"4"}>
                                <FaTrash />
                            </IconButton>
                        </PopoverTrigger>
                        <PopoverContent p={"2"}>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader fontWeight={"bold"} border={"0"}>
                                Clear &apos;{product.name}&apos; from your cart?
                            </PopoverHeader>
                            <PopoverBody>
                                You can&apos;t undo this action.
                            </PopoverBody>
                            <PopoverFooter border={"0"}>
                                <Button
                                    colorScheme={"red"}
                                    size={"sm"}
                                    onClick={() => dispatch(cartClear(product))}
                                >
                                    Clear
                                </Button>
                            </PopoverFooter>
                        </PopoverContent>
                    </>

                    }
                </Popover>

            </CardBody>
        </Card>
    );
};
