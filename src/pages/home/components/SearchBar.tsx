import { Box } from "@chakra-ui/react";
import { AsyncSelect, chakraComponents, OptionBase } from "chakra-react-select";
import { useLazySearchQuery } from "../../../app/api/products";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../util/routes";

interface ResultOption extends OptionBase {
    label: string;
    value: string;
}

const asyncComponents = {
    LoadingIndicator: (props: any) =>
        <chakraComponents.LoadingIndicator
            color="currentColor"
            emptyColor="transparent"
            spinnerSize="md"
            speed="0.45s"
            thickness="2px"
            {...props}
        />
    ,
};

const debounce = (fn: (...args: any[]) => any, delay : number) => {
    let timeout: any;

    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

export const SearchBar: React.FC = () => {
    const navigate = useNavigate();
    const [search] = useLazySearchQuery();

    const debouncedSearch = useCallback(
        debounce((inputValue: string, callback: (options: any) => void) => {
            search({ query: inputValue })
                .unwrap()
                .then(products => callback(
                    products.map(p => ({ label: p.name, value: p.id }))),
                );
        }, 500),
        [],
    );

    return <Box my={"24"}>
        <AsyncSelect<ResultOption>
            components={asyncComponents}
            placeholder={"Search for something..."}
            loadOptions={debouncedSearch}
            onChange={(newValue, { action }) => {
                if (!newValue) return;

                if (action === "select-option") {
                    navigate(AppRoutes.Product(newValue.value));
                }
            }}
        />
    </Box>;
};

