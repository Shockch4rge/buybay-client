import { Center, Container, Heading, ScaleFade, useDisclosure, VStack } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

export const CheckoutSuccessPage: React.FC = () => {
    const { isOpen, onToggle } = useDisclosure();

    return <Container maxW={"5xl"} centerContent>
        <ScaleFade in>
            <Center w={"72"} h={"72"}>
                <VStack>
                    <FaCheckCircle />
                    <Heading>Payment completed!</Heading>
                </VStack>
            </Center>
        </ScaleFade>
    </Container>;
};