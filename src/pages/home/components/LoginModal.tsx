import { Field, Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Hide,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { useAuth } from "../../../app/context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { closeModal, openModal } from "../../../app/store/slices/ui/modals";

const loginModalName = "login";
const emailFieldName = "email";
const passwordFieldName = "password";

export const LoginModal: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, loginUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { open } = useAppSelector(state => state.ui.modals.login);

    const close = useCallback(() => dispatch(closeModal(loginModalName)), []);

    return (
        <Modal size={["xs", "md", "lg", "xl"]} isCentered isOpen={open} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading>buybay</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <Formik
                    validationSchema={LoginSchema}
                    initialValues={{
                        [emailFieldName]: "",
                        [passwordFieldName]: "",
                    }}
                    onSubmit={async ({ email, password }) => {
                        await loginUser({
                            email,
                            password,
                        });
                        close();
                    }}
                >
                    {({ errors, touched, isSubmitting, isValid, getFieldProps }) => 
                        <ModalBody>
                            <Heading textAlign="center" size="lg">
                                Login <Hide below="md">to your account</Hide>
                            </Heading>

                            <Form>
                                <VStack mt="10" spacing="6" justify="center">
                                    <Field name={emailFieldName}>
                                        {(props: any) => 
                                            <FormControl
                                                isInvalid={!!errors.email && touched.email}
                                            >
                                                <FormLabel htmlFor={emailFieldName}>
                                                    Email
                                                </FormLabel>
                                                <Input
                                                    {...getFieldProps(emailFieldName)}
                                                    id={emailFieldName}
                                                    placeholder="e.g. johndoe@gmail.com"
                                                />
                                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                                            </FormControl>
                                        }
                                    </Field>

                                    <Field name={passwordFieldName}>
                                        {(props: any) => 
                                            <FormControl
                                                isInvalid={!!errors.password && touched.password}
                                            >
                                                <Text
                                                    mb="-6"
                                                    textColor="green.400"
                                                    textDecor="underline"
                                                    textAlign="end"
                                                    fontSize="sm"
                                                    cursor="pointer"
                                                    onClick={() => {
                                                        close();
                                                        setTimeout(() => {
                                                            dispatch(openModal("resetPassword"));
                                                        }, 300);
                                                    }}
                                                >
                                                    Forgot your password?
                                                </Text>
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
                                    variant="primary"
                                    disabled={
                                        !isValid ||
                                        isSubmitting ||
                                        !touched.email ||
                                        !touched.password
                                    }
                                >
                                    {isSubmitting ? <Spinner /> : "Login"}
                                </Button>
                            </Form>

                            <Text
                                my="8"
                                textAlign="center"
                                textDecor="underline"
                                cursor="pointer"
                                onClick={() => {
                                    close();
                                    setTimeout(() => {
                                        dispatch(openModal("register"));
                                    }, 300);
                                }}
                            >
                                <a>Create Account</a>
                            </Text>
                        </ModalBody>
                    }
                </Formik>
            </ModalContent>
        </Modal>
    );
};

const LoginSchema = Yup.object().shape({
    [emailFieldName]: Yup.string()
        .required()
        .email("Invalid email.")
        .required("Email is required."),
    [passwordFieldName]: Yup.string().required("Password is required."),
});