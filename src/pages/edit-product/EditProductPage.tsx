import { NavBar } from "../common/NavBar";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
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
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { Footer } from "../common/Footer";
import { chakraComponents } from "chakra-react-select";
import { useDeleteProductMutation, useGetProductQuery, useUpdateProductMutation } from "../../app/api/products";
import { useRef, useState } from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { CategorySelect } from "./components/CategorySelect";
import { BackButton } from "../common/BackButton";
import { useNavigate, useParams } from "react-router-dom";
import Utils from "../../util/Utils";
import { FaTrash } from "react-icons/all";
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

export const EditProductPage: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();
    const productImageInputRef = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const { data: product } = useGetProductQuery(id!);
    const [updateProduct] = useUpdateProductMutation();

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

                    const product = await updateProduct({
                        id: id!,
                        data: formData,
                    }).unwrap();
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
                        <Form name={"updateProduct"}>
                            <VStack w={"full"} mt="4" spacing="6">
                                <Field name={fields.name}>
                                    {(props: any) =>
                                        <FormControl isInvalid={!!errors.name && touched.name}>
                                            <FormLabel htmlFor={fields.name}>
                                                <Heading size={"md"}>Name</Heading>
                                            </FormLabel>
                                            <Input
                                                {...getFieldProps(fields.name)}
                                                id={`edit-product-${fields.name}`}
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
                                                id={`edit-product-${fields.description}`}
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
                                                id={`edit-product-${fields.price}`}
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
                                                id={`edit-product-${fields.quantity}`}
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
                                                <Heading mb={"2"} size={"md"}>Images (max 6)</Heading>
                                                <Text>
                                                    *Images must be in .jpg or .png format. The first image uploaded will be the product&apos;s thumbnail.
                                                </Text>
                                            </FormLabel>
                                            <SimpleGrid
                                                mb={"6"}
                                                p={"5"}
                                                borderColor={"gray.200"}
                                                borderWidth={"thin"}
                                                borderRadius={"6"}
                                                columns={4}
                                                spacing={"10"}
                                                id={"image-input"}
                                            >
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
                                                id={`edit-product-${fields.images}`}
                                                ref={productImageInputRef}
                                                type={"file"}
                                                accept={"image/**"}
                                                multiple
                                                hidden
                                                onChange={async e => {
                                                    try {
                                                        const images = await Promise.all(
                                                            Array.from(e.target.files ?? [])
                                                                .map(f => Utils.compress(f)),
                                                        );
                                                        setImages(images);
                                                    }
                                                    catch (e) {
                                                        toast({
                                                            title: "Invalid file type. Please upload a .jpeg or .png image.",
                                                            status: "error",
                                                        });
                                                    }
                                                }}
                                            />
                                            <Button onClick={() => productImageInputRef.current?.click()}>
                                                Attach images
                                            </Button>
                                        </FormControl>
                                    }
                                </Field>
                                <HStack alignSelf={"end"} spacing={"4"}>
                                    <DeleteProductDialog id={product.id} disabled={isSubmitting}/>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        alignSelf={"end"}
                                        disabled={
                                            isSubmitting ||
                                        !isValid
                                        }
                                    >
                                        {isSubmitting ? <Spinner /> : "Save Changes"}
                                    </Button>
                                </HStack>
                            </VStack>
                        </Form>
                    </>
                }
            </Formik>
        </Container>
        <Footer />
    </>;
};

const DeleteProductDialog: React.FC<{ id: string; disabled?: boolean }> = ({ id, disabled = false }) => {
    const navigate = useNavigate();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement | null>(null);
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    return <>
        <Button
            leftIcon={<FaTrash />}
            variant={"ghost"}
            disabled={disabled || isDeleting}
            onClick={onOpen}
        >
            Delete Product
        </Button>

        <AlertDialog
            isOpen={isOpen}
            motionPreset={"slideInBottom"}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete Product
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You can&apos;t undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            id={"delete-product-btn"}
                            ml={3}
                            colorScheme='red'
                            disabled={isDeleting}
                            onClick={async () => {
                                await deleteProduct(id).unwrap();
                                onClose();
                                navigate(AppRoutes.Account);
                            }}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
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
