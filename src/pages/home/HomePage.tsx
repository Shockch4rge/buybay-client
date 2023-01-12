import { Center, Heading } from "@chakra-ui/react";
import { NavBar } from "../common/NavBar";
import { ScrollRestoration } from "react-router-dom";

export const HomePage: React.FC = () => {
    return <>
        <NavBar />
        <Center h={"100vh"} w={"full"}>
            <Heading>
                Everything you need, in one place.
            </Heading>
        </Center>
        <ScrollRestoration
            getKey={(location, matches) => {
                return location.pathname;
            }}
        />
    </>;
};