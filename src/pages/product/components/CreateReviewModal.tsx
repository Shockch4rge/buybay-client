import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { closeModal } from "../../../app/store/slices/ui/modals";
import { useAddProductReviewMutation } from "../../../app/api/productReviews";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { Product } from "../../../util/models/Product";

const titleField = "title";
const descriptionField = "description";

const labelStyles = {
    mt: "4",
    ml: "-1.5",
    fontSize: "sm",
};

interface Props {
    product: Product;
}

export const CreateReviewModal: React.FC<Props> = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [rating, setRating] = useState(1);
    const [addReview] = useAddProductReviewMutation();
    const { open } = useAppSelector(state => state.ui.modals.createReview);

    const close = () => dispatch(closeModal("createReview"));

    return (
        <Modal size={["xs", "md", "lg", "3xl"]} isCentered isOpen={open} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <Formik
                    validationSchema={ReviewSchema}
                    initialValues={{
                        [titleField]: "",
                        [descriptionField]: "",
                    }}
                    onSubmit={async ({ title, description }) => {
                        await addReview({
                            author_id: "user1",
                            product_id: product.id,
                            title,
                            description,
                            rating,
                        }).unwrap();
                        close();
                    }}
                >
                    {({ errors, touched, isSubmitting, isValid, getFieldProps }) =>
                        <ModalBody>
                            <Heading size="lg">
                                Write a review
                            </Heading>
                            <Form>
                                <VStack mt="10" spacing="6" align={"start"}>
                                    <Field name={titleField}>
                                        {(props: any) =>
                                            <FormControl
                                                isInvalid={!!errors.title && touched.title}
                                            >
                                                <FormLabel htmlFor={titleField}>
                                                    Title
                                                </FormLabel>
                                                <Input
                                                    {...getFieldProps(titleField)}
                                                    id={titleField}
                                                    placeholder="Write a title"
                                                />
                                                <FormErrorMessage>{errors.title}</FormErrorMessage>
                                            </FormControl>
                                        }
                                    </Field>

                                    <Field name={descriptionField}>
                                        {(props: any) =>
                                            <FormControl
                                                isInvalid={!!errors.description && touched.description}
                                            >
                                                <FormLabel htmlFor={descriptionField}>
                                                    Description
                                                </FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        {...getFieldProps(descriptionField)}
                                                        id={descriptionField}
                                                        placeholder="Description"
                                                    />
                                                </InputGroup>
                                                <FormErrorMessage>
                                                    {errors.description}
                                                </FormErrorMessage>
                                            </FormControl>
                                        }
                                    </Field>

                                    <Text>Rating</Text>
                                    <Box w={"full"} px={"2"}>
                                        <Slider defaultValue={1} min={1} max={5} step={1} onChange={val => setRating(val)}>
                                            <SliderMark value={1} {...labelStyles}>
                                                1
                                            </SliderMark>
                                            <SliderMark value={2} {...labelStyles}>
                                                2
                                            </SliderMark>
                                            <SliderMark value={3} {...labelStyles}>
                                                3
                                            </SliderMark>
                                            <SliderMark value={4} {...labelStyles}>
                                                4
                                            </SliderMark>
                                            <SliderMark value={5} {...labelStyles}>
                                                5
                                            </SliderMark>
                                            <SliderTrack>
                                                <SliderFilledTrack bg={"green.300"} />
                                            </SliderTrack>
                                            <SliderThumb boxSize={6} textColor={"green.300"}>
                                                <FaStar />
                                            </SliderThumb>
                                        </Slider>
                                    </Box>

                                </VStack>

                                <ModalFooter>
                                    <Button
                                        mt={"12"}
                                        mb={"6"}
                                        w="full"
                                        type="submit"
                                        variant="primary"
                                        disabled={
                                            isSubmitting ||
                                            !isValid ||
                                            !touched.title ||
                                            !touched.description
                                        }
                                    >
                                        {isSubmitting ? <Spinner /> : "Create"}
                                    </Button>
                                </ModalFooter>
                            </Form>
                        </ModalBody>
                    }
                </Formik>
            </ModalContent>
        </Modal>
    );
};

const ReviewSchema = Yup.object().shape({
    [titleField]: Yup.string()
        .required("Review title is required.")
        .min(3, "Review title is too short.")
        .max(50, "Review title is too long."),
    [descriptionField]: Yup.string()
        .required("Review description is required.")
        .min(10, "Description is too short.")
        .max(500, "Description is too long."),
});