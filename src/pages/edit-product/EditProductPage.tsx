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
import { useGetProductQuery, useUpdateProductMutation } from "../../app/api/products";
import { useState } from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { CategorySelect } from "./components/CategorySelect";
import { BackButton } from "../common/BackButton";
import { useNavigate, useParams } from "react-router-dom";

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

export const EditProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const { data: product } = useGetProductQuery(id!);
    const [updateProduct] = useUpdateProductMutation();
    const fileButtonStyles = useMultiStyleConfig("Button", { variant: "secondary", size: "sm" });

    if (!product) return <></>;

    return <>
        <NavBar />
        <Container minH={"max"} maxW={"5xl"}>
            <BackButton />
            <Heading my={"12"} size={"lg"}>
                Edit your product listing
            </Heading>
            <Formik
                validationSchema={Schema}
                initialValues={{
                    name: product.name,
                    description: product.description,
                    categories: "",
                    images: "",
                    price: product.price,
                    quantity: product.quantity,
                }}
                onSubmit={async values => {
                    const formData = new FormData();
                    formData.set(fields.name, values.name);
                    formData.set(fields.description, values.description);
                    formData.set(fields.price, values.price.toString());
                    formData.set(fields.quantity, values.quantity.toString());

                    for (const image of images) {
                        formData.append(`${fields.images}[]`, image);
                    }

                    for (const category of categories) {
                        formData.append(`${fields.categories}[]`, category);
                    }

                    console.log(Array.from(formData.values()));

                    const product = await updateProduct({
                        id: id!,
                        data: formData,
                    }).unwrap();
                    // navigate(AppRoutes.Product(product.id));
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
                                <CategorySelect product={product} onCreate={setCategories} />
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
                                                min={1}
                                                defaultValue={getFieldProps(fields.quantity).value}
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
                                <Field name={fields.images}>
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
                                                {images.length > 0
                                                    ? images.map(image =>
                                                        <Image
                                                            key={image.name}
                                                            src={URL.createObjectURL(image)}
                                                            alt={image.name}
                                                            objectFit={"cover"}
                                                            borderRadius={"md"}
                                                            boxSize={"56"}
                                                        />,
                                                    )
                                                    : product.images.map((image, i) =>
                                                        <Image
                                                            key={`${image.productId}-image-${i}`}
                                                            src={image.url}
                                                            objectFit={"cover"}
                                                            borderRadius={"md"}
                                                            boxSize={"56"}
                                                        />)
                                                }
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
                                        !isValid
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

const Schema = Yup.object().shape({
    name: Yup.string().required("Your product must have a name."),
    description: Yup.string().required("Your product must have a description."),
    price: Yup.number().required("Your product must state a price."),
    quantity: Yup.number()
        .min(1)
        .integer()
        .required("You must state the stock of products in possession."),
});

