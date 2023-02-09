import { HStack, Text } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

interface Props {
    rating: number;
}

export const Rating: React.FC<Props> = ({ rating }) => {
    return <HStack>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) =>
            <Text key={i} color={i < rating ? "green.300" : "gray.400"}>
                <FaStar/>
            </Text>,
        )}
    </HStack>;
};