import { PropsWithChildren } from "react";
import { BoxProps, Center } from "@chakra-ui/react";

export const EmptyContent: React.FC<PropsWithChildren<BoxProps>> = props => {
    return <Center
        w={"full"}
        py={"12"}
        px={"4"}
        borderRadius={"md"}
        borderWidth={"medium"}
        borderStyle={"dashed"}
        borderColor={"gray.300"}
        textAlign={"center"}
        {...props}
    >
        {props.children}
    </Center>;
};