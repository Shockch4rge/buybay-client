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
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Spinner,
    Text,
    Textarea,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { closeModal } from "../../../app/store/slices/ui/modals";
import { useDeleteProductReviewMutation, useUpdateProductReviewMutation } from "../../../app/api/productReviews";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../../app/context/AuthContext";
import { ProductReview } from "../../../util/models/ProductReview";
import { FaCheck, FaTrash } from "react-icons/all";

const fields = {
    title: "title",
    description: "description",
    rating: "rating",
} as const;

const labelStyles = {
    mt: "4",
    ml: "-1.5",
    fontSize: "sm",
};

interface Props {
    review: ProductReview;
}

export const EditReviewModal: React.FC<Props> = ({ review }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const toast = useToast();
    const { user } = useAuth();
    const [updateReview, { isLoading: isUpdating }] = useUpdateProductReviewMutation();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteProductReviewMutation();
    const { open } = useAppSelector(state => state.ui.modals.editReview);

    const isLoading = isUpdating || isDeleting;

    const close = () => dispatch(closeModal("editReview"));

    return (
        <Modal size={["xs", "md", "lg", "3xl"]} isCentered isOpen={open} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <Formik
                    validationSchema={Schema}
                    initialValues={{
                        [fields.title]: review.title,
                        [fields.description]: review.description,
                        [fields.rating]: review.rating,
                    }}
                    onSubmit={async ({ title, description, rating }) => {
                        await updateReview({
                            id: review.id,
                            title,
                            description,
                            rating,
                        }).unwrap();
                        close();
                    }}
                >
                    {({ errors, touched, isSubmitting, isValid, getFieldProps, setFieldValue }) =>
                        <ModalBody>
                            <Heading size="lg">
                                Edit your review
                            </Heading>
                            <Form>
                                <VStack mt="10" spacing="6" align={"start"}>
                                    <Field name={fields.title}>
                                        {(props: any) =>
                                            <FormControl
                                                isInvalid={!!errors.title && touched.title}
                                            >
                                                <FormLabel htmlFor={fields.title}>
                                                    Title
                                                </FormLabel>
                                                <Input
                                                    {...getFieldProps(fields.title)}
                                                    id={fields.title}
                                                    placeholder="Write a title"
                                                />
                                                <FormErrorMessage>{errors.title}</FormErrorMessage>
                                            </FormControl>
                                        }
                                    </Field>

                                    <Field name={fields.description}>
                                        {(props: any) =>
                                            <FormControl
                                                isInvalid={!!errors.description && touched.description}
                                            >
                                                <FormLabel htmlFor={fields.description}>
                                                    Description
                                                </FormLabel>
                                                <InputGroup>
                                                    <Textarea
                                                        {...getFieldProps(fields.description)}
                                                        id={fields.description}
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
                                        <Field name={fields.rating}>
                                            {(props: any) =>
                                                <Slider
                                                    {...getFieldProps(fields.rating)}
                                                    defaultValue={1}
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    onChange={val => setFieldValue(fields.rating, val)}
                                                >
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
                                            }
                                        </Field>
                                    </Box>

                                </VStack>

                                <ModalFooter mt={"12"} mb={"6"} gap={"4"}>
                                    <Popover>
                                        {({ onClose }) => <>
                                            <PopoverTrigger>
                                                <Button
                                                    leftIcon={<FaTrash />}
                                                    variant={"ghost"}
                                                >
                                                    {isSubmitting ? <Spinner /> : "Delete Review"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent p={"2"}>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                <PopoverHeader fontWeight={"bold"} border={"0"}>
                                                    Are you sure?
                                                </PopoverHeader>
                                                <PopoverBody>
                                                    You can&apos;t undo this action.
                                                </PopoverBody>
                                                <PopoverFooter border={"0"}>
                                                    <Button
                                                        colorScheme={"red"}
                                                        size={"sm"}
                                                        disabled={isSubmitting || isLoading}
                                                        onClick={async () => {
                                                            await deleteReview(review.id).unwrap();
                                                            toast({
                                                                status: "success",
                                                                title: "Review deleted!",
                                                            });
                                                            onClose();
                                                            close();
                                                        }}>
                                                        {isSubmitting || isLoading ? <Spinner /> : "Delete"}
                                                    </Button>
                                                </PopoverFooter>
                                            </PopoverContent>
                                        </>

                                        }
                                    </Popover>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        leftIcon={<FaCheck />}
                                        disabled={
                                            isSubmitting ||
                                            !isValid ||
                                            !touched.title ||
                                            !touched.description
                                        }
                                    >
                                        {isSubmitting || isLoading ? <Spinner /> : "Save Changes"}
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

const Schema = Yup.object().shape({
    [fields.title]: Yup.string()
        .required("Review title is required.")
        .min(3, "Review title is too short.")
        .max(50, "Review title is too long."),
    [fields.description]: Yup.string()
        .required("Review description is required.")
        .min(10, "Description is too short.")
        .max(500, "Description is too long."),
    [fields.rating]: Yup.number()
        .required("Rating is required.")
        .min(1, "Rating is too low.")
        .max(5, "Rating is too high."),
});