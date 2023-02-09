import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { closeModal } from "../../../app/store/slices/ui/modals";
import { useAuth } from "../../../app/context/AuthContext";

const emailFieldName = "email";
const passwordFieldName = "password";

export const DeleteAccountModal: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { deleteUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { open } = useAppSelector(state => state.ui.modals.deleteAccount);

    const close = () => dispatch(closeModal("deleteAccount"));

    return (
        <Modal size={["xs", "md", "lg", "xl"]} isCentered isOpen={open} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                </ModalHeader>
                <ModalCloseButton />
                <Formik
                    validationSchema={Schema}
                    initialValues={{
                        [passwordFieldName]: "",
                    }}
                    onSubmit={async ({ password }) => {
                        await deleteUser({ password });
                        close();
                    }}
                >
                    {({ errors, touched, isSubmitting, isValid, getFieldProps }) =>
                        <ModalBody>
                            <Heading>
                                Delete your account
                            </Heading>
                            <Text mt={"4"}>
                                This action is irreversible. Enter your password to confirm.
                            </Text>
                            <Form name={"deleteAccount"}>
                                <VStack mt="10" spacing="6" justify="center">
                                    <Field name={passwordFieldName}>
                                        {(props: any) =>
                                            <FormControl
                                                isInvalid={!!errors.password && touched.password}
                                            >
                                                <FormLabel htmlFor={passwordFieldName}>
                                                    Password
                                                </FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        {...getFieldProps(passwordFieldName)}
                                                        id={passwordFieldName}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Password"
                                                    />
                                                    <Tooltip
                                                        label="Toggle Visibility"
                                                        openDelay={1000}
                                                        hasArrow
                                                    >
                                                        <InputRightElement
                                                            onClick={() =>
                                                                setShowPassword(!showPassword)
                                                            }
                                                        >
                                                            <IconButton
                                                                size="sm"
                                                                bg="transparent"
                                                                aria-label="Toggle password visibility"
                                                            >
                                                                {showPassword ?
                                                                    <FaEye size="20" />
                                                                    :
                                                                    <FaEyeSlash size="20" />
                                                                }
                                                            </IconButton>
                                                        </InputRightElement>
                                                    </Tooltip>
                                                </InputGroup>
                                                <FormErrorMessage>
                                                    {errors.password}
                                                </FormErrorMessage>
                                            </FormControl>
                                        }
                                    </Field>
                                </VStack>

                                <Button
                                    mt="12"
                                    w="full"
                                    type="submit"
                                    colorScheme={"red"}
                                    isDisabled={!isValid || !touched.password}
                                    isLoading={isSubmitting}
                                >
                                    Delete
                                </Button>
                            </Form>
                        </ModalBody>
                    }
                </Formik>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const Schema = Yup.object().shape({
    [passwordFieldName]: Yup.string().required("Password is required."),
});