import { PropsWithChildren } from "react";
import { BoxProps, Center } from "@chakra-ui/react";

export const EmptyContent: React.FC<PropsWithChildren<BoxProps>> = props => {
    return <Center
        w={"full"}
        py={"12"}
        borderRadius={"md"}
        borderWidth={"medium"}
        borderStyle={"dashed"}
        borderColor={"gray.300"}
        {...props}
    >
        {props.children}
    </Center>;
};