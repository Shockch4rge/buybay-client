import { NavBar } from "../common/NavBar";
import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Image,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    SimpleGrid,
    Spinner,
    Text,
    Textarea,
    useMultiStyleConfig,
    VStack,
} from "@chakra-ui/react";
import { Footer } from "../common/Footer";
import { chakraComponents } from "chakra-react-select";
import { useAddProductMutation } from "../../app/api/products";
import { useState } from "react";
import * as Yup from "yup";
import { useAuth } from "../../app/context/AuthContext";
import { Field, Form, Formik } from "formik";
import { CategorySelect } from "./components/CategorySelect";
import { BackButton } from "../common/BackButton";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../util/routes";

const fields = {
    name: "name",
    description: "description",
    categories: "categories",
    price: "price",
    quantity: "quantity",
    images: "images",
};

const asyncComponents = {
    LoadingIndicator: (props: any) => <chakraComponents.LoadingIndicator
        color="currentColor"
        emptyColor="transparent"
        spinnerSize="md"
        speed="0.45s"
        thickness="2px"
        {...props}
    />,
};

const format = (val: string) => `$` + val;
const parse = (val: string) => val.replace(/^\$/, "");

export const SellProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation();
    const fileButtonStyles = useMultiStyleConfig("Button", { variant: "secondary", size: "sm" });

    return <>
        <NavBar />
        <Container minH={"max"} maxW={"5xl"}>
            <BackButton />
            <Heading my={"12"} size={"lg"}>
                List a product on buybay
            </Heading>
            <Formik
                validationSchema={CreateProductSchema}
                initialValues={{
                    name: "",
                    description: "",
                    categories: "",
                    images: "",
                    price: 0,
                    quantity: 0,
                }}
                onSubmit={async values => {
                    const formData = new FormData();
                    formData.set(fields.name, values.name);
                    formData.set(fields.description, values.description);
                    formData.set(fields.price, values.price.toString());
                    formData.set(fields.quantity, values.quantity.toString());
                    formData.set("seller_id", user!.id);

                    for (const image of images) {
                        formData.append(`${fields.images}[]`, image);
                    }

                    for (const category of categories) {
                        formData.append(`${fields.categories}[]`, category);
                    }

                    const product = await addProduct(formData).unwrap();
                    navigate(AppRoutes.Product(product.id));
                }}
            >
                {({
                    errors,
                    touched,
                    isSubmitting,
                    getFieldProps,
                    setFieldValue,
                    isValid,
                }) =>
                    <>
                        <Form>
                            <VStack w={"full"} mt="4" spacing="6">
                                <Field name={fields.name}>
                                    {(props: any) =>
                                        <FormControl isInvalid={!!errors.name && touched.name}>
                                            <FormLabel htmlFor={fields.name}>
                                                <Heading size={"md"}>Name</Heading>
                                            </FormLabel>
                                            <Input
                                                {...getFieldProps(fields.name)}
                                                id={fields.name}
                                                placeholder="Product Name"
                                            />
                                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>
                                    }
                                </Field>
                                <Field name={fields.description}>
                                    {(props: any) =>
                                        <FormControl
                                            isInvalid={!!errors.description && touched.description}
                                        >
                                            <FormLabel htmlFor={fields.description}>
                                                <Heading size={"md"}>Description</Heading>
                                            </FormLabel>
                                            <Textarea
                                                {...getFieldProps(fields.description)}
                                                id={fields.description}
                                                placeholder="Product Description"
                                            />
                                            <FormErrorMessage>{errors.description}</FormErrorMessage>
                                        </FormControl>
                                    }
                                </Field>
                                <CategorySelect onCreate={setCategories} />
                                <Field name={fields.price}>
                                    {(props: any) =>
                                        <FormControl isInvalid={!!errors.price && touched.price}>
                                            <FormLabel htmlFor={fields.price}>
                                                <Heading size={"md"}>Price per item ($)</Heading>
                                            </FormLabel>
                                            <NumberInput
                                                {...getFieldProps(fields.price)}
                                                id={fields.price}
                                                min={0.01}
                                                precision={2}
                                                step={0.5}
                                                onChange={(_, value) => setFieldValue(fields.price, value.toFixed(2))}
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            <FormErrorMessage>{errors.price}</FormErrorMessage>
                                        </FormControl>
                                    }
                                </Field>
                                <Field name={fields.quantity}>
                                    {(props: any) =>
                                        <FormControl isInvalid={!!errors.quantity && touched.quantity}>
                                            <FormLabel htmlFor={fields.quantity}>
                                                <Heading size={"md"}>Quantity</Heading>
                                            </FormLabel>
                                            <NumberInput
                                                {...getFieldProps(fields.quantity)}
                                                id={fields.quantity}
                                                defaultValue={1}
                                                min={1}
                                                onChange={(_, value) => setFieldValue(fields.quantity, value)}
                                            >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                                        </FormControl>
                                    }
                                </Field>
                                <Field>
                                    {() =>
                                        <FormControl>
                                            <FormLabel htmlFor={"image-input"}>
                                                <VStack spacing={"1"} alignItems={"start"}>
                                                    <Heading size={"md"}>Images (max 6)</Heading>
                                                    <Text>
                                                        *Images must be in .jpg, .jpeg, or .png format.
                                                    </Text>
                                                    <Text>
                                                        *First image uploaded will be the product thumbnail.
                                                    </Text>
                                                </VStack>
                                            </FormLabel>
                                            <SimpleGrid mb={"6"} columns={4} spacing={"10"} id={"image-input"}>
                                                {images.map(image =>
                                                    <Image
                                                        key={image.name}
                                                        src={URL.createObjectURL(image)}
                                                        alt={image.name}
                                                        objectFit={"cover"}
                                                        borderRadius={"md"}
                                                        boxSize={"56"}
                                                    />,
                                                )}
                                            </SimpleGrid>
                                            {images.length > 0 && <Heading mb={"6"} size={"md"}>
                                                {images.length} {images.length === 1 ? "image" : "images"}
                                            </Heading>}
                                            <Input
                                                {...getFieldProps(fields.images)}
                                                id={fields.images}
                                                type={"file"}
                                                multiple
                                                border={"none"}
                                                placeholder="e.g. John Doe"
                                                sx={{
                                                    "::file-selector-button": {
                                                        border: "none",
                                                        outline: "none",
                                                        ml: -4,
                                                        mr: 8,
                                                        cursor: "pointer",
                                                        ...fileButtonStyles,
                                                    },
                                                }}
                                                onChange={e => setImages(Array.from(e.target.files ?? []))}
                                            />
                                        </FormControl>
                                    }
                                </Field>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    alignSelf={"end"}
                                    disabled={
                                        isSubmitting ||
                                        !isValid ||
                                        !touched.name ||
                                        !touched.description
                                    }
                                >
                                    {isSubmitting ? <Spinner /> : "List Product"}
                                </Button>
                            </VStack>
                        </Form>
                    </>
                }
            </Formik>
        </Container>
        <Footer />
    </>;
};

const CreateProductSchema = Yup.object().shape({
    name: Yup.string().required("Your product must have a name."),
    description: Yup.string().required("Your product must have a description."),
    price: Yup.number().required("Your product must state a price."),
    quantity: Yup.number()
        .min(1)
        .integer()
        .required("You must state the stock of products in possession."),
});

