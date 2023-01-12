import {
    Button,
    Flex,
    Heading,
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    VStack,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../util/routes";
import { useAuth } from "../../app/context/AuthContext";

export const NavBar: React.FC = () => {
    const navigate = useNavigate();

    return <Flex zIndex={1} align={"center"} h={"20"} w={"full"} p={"4"} bgColor={"white"} pos={"fixed"} justify={"space-between"}>
        <Heading>
            buybay
        </Heading>
        <Flex minW={"12"} justify={"space-around"}>
            <AuthButton />
            <Button variant={"ghost"} leftIcon={<FaShoppingCart />} onClick={() => navigate(AppRoutes.Cart)}>
                Cart ({4})
            </Button>
        </Flex>
    </Flex>;
};

export const AuthButton: React.FC = () => {
    const { loginUser } = useAuth();

    const signInButton = <Popover>
        <PopoverTrigger>
            <Button variant={"ghost"}>
                Sign In
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <VStack p={"6"} justify={"center"}>
                <Button w={"full"} variant={"primary"} onClick={() => loginUser({

                })}>
                    Sign In
                </Button>
                <Button w={"full"} variant={"ghost"}>
                    Sign Up
                </Button>
            </VStack>
        </PopoverContent>
    </Popover>;

    const accountButton = <Popover>
        <PopoverTrigger>
            <Button variant={"ghost"}>
                Account
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverHeader textAlign={"center"}>
                Account
            </PopoverHeader>
            <VStack p={"2"} justify={"center"}>
                <Button w={"full"} onClick={() => logout({
                    returnTo: window.location.origin,
                })}>
                    Sign Out
                </Button>
            </VStack>
        </PopoverContent>
    </Popover>;

    return isAuthenticated ? accountButton : signInButton;
};