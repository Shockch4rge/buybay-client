import { Field, Form, Formik } from "formik";
import { useCallback } from "react";
import * as Yup from "yup";

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { closeModal } from "../../app/store/slices/ui/modals";


const emailFieldName = "email";

export const ResetPasswordModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { open } = useAppSelector(state => state.ui.modals.resetPassword);

    const close = useCallback(() => dispatch(closeModal("resetPassword")), []);

    return (
        <Modal size={["xs", "md", "lg", "xl"]} isOpen={open} onClose={close} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading textAlign={"center"}>
                        buybay
                    </Heading>
                </ModalHeader>
                <ModalCloseButton />
                <Formik
                    validationSchema={ResetPasswordSchema}
                    initialValues={{
                        [emailFieldName]: "",
                    }}
                    onSubmit={(values, actions) => {}}
                >
                    {({ errors, touched, validateForm, isSubmitting, isValid, dirty, getFieldProps }) => 
                        <ModalBody>
                            <Heading size="lg">Reset your password</Heading>
                            <Text mt="4">
                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                We'll send a confirmation link to your email to reset your password.
                            </Text>
                            <Form>
                                <VStack mt="10" spacing="6" justify="center">
                                    <Field name={emailFieldName}>
                                        {(props: any) => 
                                            <FormControl isInvalid={!!errors.email && touched.email}>
                                                <FormLabel htmlFor={emailFieldName}>Email</FormLabel>
                                                <Input
                                                    {...getFieldProps(emailFieldName)}
                                                    id={emailFieldName}
                                                    placeholder="e.g. johndoe@gmail.com"
                                                />
                                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                                            </FormControl>
                                        }
                                    </Field>
                                </VStack>
                                <Button
                                    my="8"
                                    w="full"
                                    type="submit"
                                    variant="primary"
                                    disabled={!isValid || isSubmitting || dirty || !touched.email}
                                >
                                    Send confirmation link
                                </Button>
                            </Form>
                        </ModalBody>
                    }
                </Formik>
            </ModalContent>
        </Modal>
    );
};

const ResetPasswordSchema = Yup.object().shape({
    emailFieldName: Yup.string()
        .email("Invalid email")
        .required("Required"),
});