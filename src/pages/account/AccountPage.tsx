import { Container, Heading, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { Footer } from "../common/Footer";
import { BackButton } from "../common/BackButton";
import { FaDollarSign, FaPen, FaUser } from "react-icons/all";
import { FaShoppingCart } from "react-icons/fa";
import { ProfileTab } from "./components/ProfileTab";
import { OrdersTab } from "./components/OrdersTab";
import { SalesTab } from "./components/SalesTab";
import { DeleteAccountModal } from "./components/DeleteAccountModal";
import { ListedProductsTab } from "./components/ListedProductsTab";

export const AccountPage: React.FC = () => {
    return <>
        <Container minH={"100vh"} mt={"16"} maxW={"5xl"}>
            <BackButton />
            <Heading my={"6"}>Account</Heading>
            <Tabs
                isFitted
                variant={"soft-rounded"}
                colorScheme={"green"}
                onChange={i => localStorage.setItem("account-tab-idx", `${i}`)}
                defaultIndex={Number(localStorage.getItem("account-tab-idx")) ?? 0}
            >
                <TabList gap={"2"} p={"2"} bg={"gray.50"} borderRadius={"12"}>
                    <Tab borderRadius={"10"}><FaUser/>&nbsp; Profile</Tab>
                    <Tab borderRadius={"10"}><FaPen/>&nbsp; Listed Products</Tab>
                    <Tab borderRadius={"10"}><FaShoppingCart/>&nbsp; Orders</Tab>
                    <Tab borderRadius={"10"}><FaDollarSign/>&nbsp; Sales</Tab>
                </TabList>
                <TabPanels mt={"4"} p={"4"} bg={"gray.50"} borderRadius={"6"}>
                    <ProfileTab />
                    <ListedProductsTab />
                    <OrdersTab />
                    <SalesTab />
                </TabPanels>
            </Tabs>
        </Container>
        <Footer />
        <DeleteAccountModal />

    </>;
};