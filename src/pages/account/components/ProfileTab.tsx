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
import { useRef, useState } from "react";
import { FaCheck, FaRedo, FaSignOutAlt, FaTrash } from "react-icons/all";
import { openModal } from "../../../app/store/slices/ui/modals";
import { useAppDispatch } from "../../../app/store/hooks";
import Utils from "../../../util/Utils";

const fields = {
    name: "name",
    email: "email",
    avatar: "avatar",
};

export const ProfileTab: React.FC = () => {
    const { user, updateUser, logoutUser } = useAuth();
    const [avatar, setAvatar] = useState<File | null>(null);
    const fileButtonStyles = useMultiStyleConfig("Button", { variant: "secondary", size: "sm" });
    const dispatch = useAppDispatch();
    const avatarInputRef = useRef<HTMLInputElement | null>(null);

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
            onSubmit={async ({ name, email }) => {
                const formData = new FormData();

                formData.append("name", name);
                formData.append("email", email);

                if (avatar) {
                    formData.append("avatar", avatar);
                }

                await updateUser({
                    id: user.id,
                    form: formData,
                });
            }}
        >
            {({ errors, touched, isSubmitting, isValid, dirty, getFieldProps, values }) =>
                <>
                    <Form name={"updateUser"}>
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
                                            ref={avatarInputRef}
                                            type={"file"}
                                            accept={"image/**"}
                                            border={"none"}
                                            hidden
                                            onChange={async e => {
                                                const file = e.target.files?.item(0);
                                                if (file) {
                                                    setAvatar(await Utils.compress(file));
                                                }
                                            }}
                                        />
                                        <Button onClick={() => avatarInputRef.current?.click()}>Choose avatar</Button>
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
                    <ButtonGroup mt={"12"} alignSelf={"end"}>
                        <Button
                            size={"sm"}
                            variant={"primary"}
                            leftIcon={<FaCheck />}
                            type={"submit"}
                            onClick={async () => {
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
                            }}>
                            Save Changes
                        </Button>
                        <Button size={"sm"} variant={"ghost"} leftIcon={<FaSignOutAlt />} onClick={() => logoutUser()}>
                            Log out
                        </Button>
                        <Button
                            size={"sm"}
                            variant={"secondaryGhost"}
                            leftIcon={<FaRedo />}
                            onClick={() => dispatch(openModal("resetPassword"))}
                        >
                            Reset Password
                        </Button>
                        <Button
                            size={"sm"}
                            colorScheme={"red"}
                            variant={"ghost"}
                            leftIcon={<FaTrash />}
                            onClick={() => dispatch(openModal("deleteAccount"))}
                        >
                            Delete Account
                        </Button>
                    </ButtonGroup>
                </>
            }
        </Formik>
    </TabPanel>;
};

const UpdateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string()
        .required("Email is required.")
        .email(),
});