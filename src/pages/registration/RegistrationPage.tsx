import {
    Avatar,
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Text,
    Tooltip,
    useMultiStyleConfig,
    VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import { useState } from "react";
import { BackButton } from "../common/BackButton";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "../common/LoginModal";
import { openModal } from "../../app/store/slices/ui/modals";
import { useAppDispatch } from "../../app/store/hooks";
import { useAuth } from "../../app/context/AuthContext";
import { AppRoutes } from "../../util/routes";

const fields = {
    name: "name",
    email: "email",
    password: "password",
    confirmPassword: "confirmPassword",
    avatar: "avatar",
};

export const RegistrationPage: React.FC = () => {
    const [avatar, setAvatar] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { registerUser } = useAuth();
    const fileButtonStyles = useMultiStyleConfig("Button", { variant: "secondary", size: "sm" });
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    return <>
        <Container my={"24"} maxW={"4xl"}>
            <BackButton />
            <Heading my={"12"}>Register for a BuyBay account</Heading>
            <Formik
                validationSchema={RegisterSchema}
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    avatar: "",
                }}
                onSubmit={async values => {
                    const formData = new FormData();
                    formData.append(fields.name, values.name);
                    formData.append(fields.email, values.email);
                    formData.append(fields.password, values.password);

                    if (avatar) {
                        formData.append(fields.avatar, avatar);
                    }

                    await registerUser(formData);
                    navigate(AppRoutes.Home, { replace: true });
                }}
            >
                {({ errors, touched, isSubmitting, isValid, dirty, getFieldProps }) =>
                    <>
                        <Form>
                            <VStack mt="4" spacing="6">
                                <Avatar
                                    alignSelf={"start"}
                                    size={"2xl"}
                                    src={avatar ? URL.createObjectURL(avatar) : undefined}
                                />
                                <Field name={fields.avatar}>
                                    {(props: any) =>
                                        <FormControl isInvalid={!!errors.avatar && touched.avatar}>
                                            <FormLabel htmlFor={fields.avatar}>Avatar</FormLabel>
                                            <Input
                                                {...getFieldProps(fields.avatar)}
                                                id={fields.avatar}
                                                type={"file"}
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
                                                onChange={e => {
                                                    const file = e.target.files?.item(0);
                                                    if (file) {
                                                        setAvatar(file);
                                                    }
                                                }}
                                            />
                                            <FormErrorMessage>{errors.avatar}</FormErrorMessage>
                                        </FormControl>
                                    }
                                </Field>
                                <Field name={fields.name}>
                                    {(props: any) =>
                                        <FormControl isInvalid={!!errors.name && touched.name}>
                                            <FormLabel htmlFor={fields.name}>Name</FormLabel>
                                            <Input
                                                {...getFieldProps(fields.name)}
                                                id={fields.name}
                                                placeholder="e.g. John Doe"
                                            />
                                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>
                                    }
                                </Field>
                                <Field name={fields.email}>
                                    {(props: any) =>
                                        <FormControl
                                            isInvalid={!!errors.email && touched.email}
                                        >
                                            <FormLabel htmlFor={fields.email}>
                                                Email
                                            </FormLabel>
                                            <Input
                                                {...getFieldProps(fields.email)}
                                                id={fields.email}
                                                placeholder="e.g. johndoe@gmail.com"
                                            />
                                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                                        </FormControl>
                                    }
                                </Field>
                                <Field name={fields.password}>
                                    {(props: any) =>
                                        <FormControl
                                            isInvalid={!!errors.password && touched.password}
                                        >
                                            <FormLabel htmlFor={fields.password}>
                                                Password
                                            </FormLabel>
                                            <InputGroup>
                                                <Input
                                                    {...getFieldProps(fields.password)}
                                                    id={fields.password}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Password"
                                                />
                                                <Tooltip
                                                    label="Toggle Visibility"
                                                    openDelay={1000}
                                                    hasArrow
                                                >
                                                    <InputRightElement
                                                        cursor={
                                                            showPassword ? "pointer" : "default"
                                                        }
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
                                <Field name={fields.confirmPassword}>
                                    {(props: any) =>
                                        <FormControl
                                            isInvalid={!!errors.confirmPassword && touched.confirmPassword}
                                        >
                                            <FormLabel htmlFor={fields.confirmPassword}>
                                                Password
                                            </FormLabel>
                                            <InputGroup>
                                                <Input
                                                    {...getFieldProps(fields.confirmPassword)}
                                                    id={fields.confirmPassword}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Password"
                                                />
                                                <Tooltip
                                                    label="Toggle Visibility"
                                                    openDelay={1000}
                                                    hasArrow
                                                >
                                                    <InputRightElement
                                                        cursor={showPassword ? "pointer" : "default"}
                                                        onClick={() => setShowPassword(!showPassword)}
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
                                                {errors.confirmPassword}
                                            </FormErrorMessage>
                                        </FormControl>
                                    }
                                </Field>
                            </VStack>
                            <Text mt="5" fontSize="sm">
                                *All fields are required.
                            </Text>

                            <Button
                                mt="10"
                                w="full"
                                type="submit"
                                variant="primary"
                                disabled={
                                    isSubmitting ||
                                    !isValid ||
                                    !dirty ||
                                    !touched.email ||
                                    !touched.password ||
                                    !touched.name
                                }
                            >
                                {isSubmitting ? <Spinner /> : "Create Account"}
                            </Button>
                        </Form>

                        <Text
                            my="4"
                            textAlign="center"
                            textDecor="underline"
                            fontSize={["sm", "md"]}
                            cursor="pointer"
                            onClick={() => dispatch(openModal("login"))}
                        >
                            <a>Login</a>
                        </Text>
                    </>
                }
            </Formik>
        </Container>
        <LoginModal />
    </>;
};

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string()
        .required("Email is required.")
        .email(),
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters."),
    confirmPassword: Yup.string()
        .required("Confirm your password.")
        .oneOf([Yup.ref("password"), null], "Passwords must match."),
});