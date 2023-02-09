import { Center, IconButton } from "@chakra-ui/react";
import { FaGithub } from "react-icons/all";

export const Footer: React.FC = () => {
    return <Center bg={"gray.700"} mt={"24"} h={"48"} w={"full"}>
        <IconButton
            aria-label={"github-icon"} 
            variant={"secondaryGhost"}
            onClick={() => window.open("https://github.com/Shockch4rge/buybay-client")}
        >
            <FaGithub size={"24"} />
        </IconButton>
    </Center>;
};