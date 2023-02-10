import { Box, Button, Container, Heading, HStack, Image, VStack } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { useAppDispatch } from "../../app/store/hooks";
import { openModal } from "../../app/store/slices/ui/modals";
import { Footer } from "../common/Footer";

export const LandingPage: React.FC = () => {
    const dispatch = useAppDispatch();

    return <>
        <Box w={"full"} p={"6"}>
            <Heading>buybay</Heading>
        </Box>
        <Container h={"100vh"} maxW={"5xl"} pt={"32"}>
            <HStack w={"full"} justify={"space-between"}>
                <VStack align={"start"} spacing={"6"}>
                    <Heading>
                        Shop for anything
                    </Heading>
                    <Button variant={"primary"} rightIcon={<FaArrowRight />} onClick={() => dispatch(openModal("login"))}>
                        Login
                    </Button>
                </VStack>
                <Image boxSize={"xl"} src={"src/assets/landing_hero.svg"} />
            </HStack>
        </Container>
        <Footer />
    </>;
};