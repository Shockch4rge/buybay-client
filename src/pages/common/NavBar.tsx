import { Button, Flex, Heading, HStack } from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../util/routes";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { openModal } from "../../app/store/slices/ui/modals";
import { useAuth } from "../../app/context/AuthContext";

export const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const cart = useAppSelector(state => state.cart);

    return <Flex
        mb={"42"}
        h={"20"}
        p={"4"}
        zIndex={1}
        align={"center"}
        bgColor={"white"}
        justify={"space-between"}
    >
        <Heading>
            buybay
        </Heading>

        <HStack>
            {user ? <AccountButton /> : <LoginButton />}
            <Button variant={"ghost"} leftIcon={<FaShoppingCart />} onClick={() => navigate(AppRoutes.Cart)}>
                Cart ({cart.items.length})
            </Button>
            <Button onClick={() => navigate(AppRoutes.SellProduct)} variant={"primary"}>
                Sell
            </Button>
        </HStack>
    </Flex>;
};

const LoginButton: React.FC = () => {
    const dispatch = useAppDispatch();

    return <Button variant={"ghost"} onClick={() => dispatch(openModal("login"))}>
        Login
    </Button>;
};

const AccountButton = () => {
    const navigate = useNavigate();

    return <Button variant={"ghost"} onClick={() => navigate(AppRoutes.Account)}>
        Account
    </Button>;
};