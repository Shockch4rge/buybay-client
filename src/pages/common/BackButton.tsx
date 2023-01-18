import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const BackButton: React.FC = () => {
    const navigate = useNavigate();

    return <Button variant={"secondaryGhost"} onClick={() => navigate(-1)} leftIcon={<FaArrowLeft />}>
        Back
    </Button>;
};