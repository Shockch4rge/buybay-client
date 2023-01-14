import { Avatar, Card, CardBody, CardHeader, Heading, HStack, Text } from "@chakra-ui/react";
import { ProductReview } from "../../../util/models/ProductReview";
import { FaStar } from "react-icons/fa";

interface Props {
    review: ProductReview;
}

export const ReviewCard: React.FC<Props> = ({ review }) => {
    return <Card variant={"outline"} borderRadius={"lg"} w="full" pos={"relative"}>
        <CardHeader>
            <HStack spacing={"6"} align={"center"}>
                <Avatar/>
                <Heading size={"md"}>{review.title}</Heading>
                <HStack>
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) =>
                        <Text key={i} color={i < review.rating ? "green.300" : "gray.400"}>
                            <FaStar/>
                        </Text>,
                    )}
                </HStack>
            </HStack>
        </CardHeader>

        <CardBody>
            <Text>
                {review.content}
            </Text>
        </CardBody>

        <Text fontSize={"sm"} pos={"absolute"} bottom={"3"} right={"4"}>
            Added on {new Date(review.createdAt).toLocaleDateString()}
        </Text>
    </Card>;
};