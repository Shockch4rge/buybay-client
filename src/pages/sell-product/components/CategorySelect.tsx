import { AsyncCreatableSelect, chakraComponents, FormatOptionLabelMeta } from "chakra-react-select";
import { useLazySearchQuery } from "../../../app/api/products";
import { useCallback } from "react";
import Highlighter from "react-highlight-words";
import Utils from "../../../util/Utils";
import { Box, FormLabel, Heading } from "@chakra-ui/react";

type SelectOption = {
    label: string;
    value: string;
};

type SelectConfig = {
    label: string;
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

function formatOptionLabel({ label }: SelectConfig, { inputValue }: FormatOptionLabelMeta<SelectConfig>) {
    return (
        <Highlighter
            searchWords={[inputValue]}
            textToHighlight={label}
            highlightStyle={{ backgroundColor: "#9ae6b4", padding: 0 }}
        />
    );
}

interface Props {
    onCreate: (categories: string[]) => void;
}

export const CategorySelect: React.FC<Props> = ({ onCreate }) => {
    const [search] = useLazySearchQuery();

    const debouncedSearch = useCallback(
        Utils.debounce((inputValue: string, cb: (config: SelectConfig[]) => void) => {
            search({ query: inputValue, includeProducts: false, limit: 25 })
                .unwrap()
                .then(result => cb([
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

    return <Box w={"full"}>
        <FormLabel htmlFor={"categories"}>
            <Heading size={"md"}>
                Categories
            </Heading>
        </FormLabel>
        <AsyncCreatableSelect
            classNamePrefix={"react-select"}
            id={"categories"}
            isMulti
            components={asyncComponents}
            placeholder={"Select or create a category"}
            loadOptions={debouncedSearch}
            colorScheme={"green"}
            formatOptionLabel={formatOptionLabel}
            noOptionsMessage={() => "Type something..."}
            loadingMessage={() => "Loading..."}
            onChange={(values, { action }) => {
                if (action === "create-option" || action === "select-option") {
                    onCreate(values.map(v => (v as unknown as SelectOption).value));
                }
            }}
        />
    </Box>;
};

