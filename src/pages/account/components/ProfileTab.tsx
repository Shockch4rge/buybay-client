import {
    Avatar,
    Button,
    ButtonGroup,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    TabPanel,
    useMultiStyleConfig,
    VStack,
} from "@chakra-ui/react";
import { useAuth } from "../../../app/context/AuthContext";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FaCheck, FaRedo, FaSignOutAlt, FaTrash } from "react-icons/all";
import { openModal } from "../../../app/store/slices/ui/modals";
import { useAppDispatch } from "../../../app/store/hooks";

const fields = {
    name: "name",
    email: "email",
    avatar: "avatar",
};

export const ProfileTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [avatar, setAvatar] = useState<File | null>(null);
    const fileButtonStyles = useMultiStyleConfig("Button", { variant: "secondary", size: "sm" });
    const dispatch = useAppDispatch();

    if (!user) return <></>;

    return <TabPanel display={"flex"} flexDirection={"column"}>
        <Heading size={"md"}>Your Profile</Heading>
        <Formik
            validationSchema={UpdateSchema}
            initialValues={{
                name: user.name,
                email: user.email,
                avatar: "",
            }}
            onSubmit={async values => {
                const formData = new FormData();
                formData.append(fields.name, values.name);
                formData.append(fields.email, values.email);

                if (avatar) {
                    formData.append(fields.avatar, avatar);
                }

                await updateUser({
                    id: user.id,
                    form: formData,
                });
            }}
        >
            {({ errors, touched, isSubmitting, isValid, dirty, getFieldProps }) =>
                <>
                    <Form>
                        <VStack mt="4" spacing="6">
                            <Avatar
                                alignSelf={"start"}
                                size={"2xl"}
                                src={user.avatarUrl ? user.avatarUrl : avatar ? URL.createObjectURL(avatar) : undefined}
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
                                            bg={"white"}
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
                                            bg={"white"}
                                            placeholder="e.g. johndoe@gmail.com"
                                        />
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                                    </FormControl>
                                }
                            </Field>
                        </VStack>
                    </Form>
                </>
            }
        </Formik>
        <ButtonGroup mt={"12"} alignSelf={"end"}>
            <Button size={"sm"} variant={"primary"} leftIcon={<FaCheck />}>
                Save Changes
            </Button>
            <Button size={"sm"} variant={"ghost"} leftIcon={<FaSignOutAlt />} onClick={() => {}}>
                Log out
            </Button>
            <Button size={"sm"} variant={"secondaryGhost"} leftIcon={<FaRedo />} onClick={() => dispatch(openModal("resetPassword"))}>
                Reset Password
            </Button>
            <Button size={"sm"} colorScheme={"red"} variant={"ghost"} leftIcon={<FaTrash />}>
                Delete Account
            </Button>
        </ButtonGroup>
    </TabPanel>;
};

const UpdateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string()
        .required("Email is required.")
        .email(),
});