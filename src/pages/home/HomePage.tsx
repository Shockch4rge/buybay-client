import { Center, Heading } from "@chakra-ui/react";
import { NavBar } from "../common/NavBar";

export const HomePage: React.FC = () => {
    return <>
        <NavBar />
        <Center h={"100vh"} w={"full"}>
            <Heading>
                Everything you need, in one place.
            </Heading>
        </Center>
    </>;
};