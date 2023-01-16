import { Box } from "@chakra-ui/react";
import { AsyncSelect, chakraComponents } from "chakra-react-select";
import { useLazyGetProductsByCategoryQuery, useLazySearchQuery } from "../../../app/api/products";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../util/routes";

type SelectOption = {
    label: string;
    value: string;
    // group label is inaccessible by default; we save it here
    group: "Categories" | "Products";
};

type SelectConfig = {
    label: SelectOption["group"];
    options: SelectOption[];
};

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
    const [getProductsByCategory] = useLazyGetProductsByCategoryQuery();

    const debouncedSearch = useCallback(
        debounce((inputValue: string, cb: (config: SelectConfig[]) => void) => {
            search({ query: inputValue })
                .unwrap()
                .then(result => cb([
                    {
                        label: "Products",
                        options: result.products.map(p => ({
                            label: p.name,
                            value: p.id,
                            group: "Products",
                        })),
                    },
                    {
                        label: "Categories",
                        options: result.categories.map(c => ({
                            label: c.name,
                            value: c.id,
                            group: "Categories",
                        })),
                    },
                ]));
        }, 500),
        [],
    );

    return <Box my={"24"}>
        <AsyncSelect<SelectConfig>
            components={asyncComponents}
            placeholder={"Search for something..."}
            loadOptions={debouncedSearch}
            onChange={(newValue, meta) => {
                if (!newValue || meta.action !== "select-option") return;

                // types are kinda wonky
                const selected = newValue as unknown as SelectOption;

                if (selected.group === "Products") {
                    navigate(AppRoutes.Product(selected.value));
                    return;
                }
                
                getProductsByCategory(selected.value)
                    .unwrap()
                    .then(console.log);
            }}
        />
    </Box>;
};

