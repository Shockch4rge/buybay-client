import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Heading,
    HStack,
    Skeleton,
    SkeletonCircle,
    Text,
    VStack,
} from "@chakra-ui/react";
import { ProductReview } from "../../../util/models/ProductReview";
import { FaStar } from "react-icons/fa";
import { useGetUserQuery } from "../../../app/api/auth";
import { useAuth } from "../../../app/context/AuthContext";
import { FaPen } from "react-icons/all";
import { useAppDispatch } from "../../../app/store/hooks";
import { openModal } from "../../../app/store/slices/ui/modals";
import { Rating } from "../../common/Rating";

interface Props {
    review: ProductReview;
}

export const ReviewCard: React.FC<Props> = ({ review }) => {
    const { data: user, isLoading: isLoadingUser } = useGetUserQuery(review.authorId);

    if (!user || isLoadingUser) {
        return <ReviewCardSkeleton />;
    }

    return <Card w="full" variant={"outline"} borderRadius={"lg"} pos={"relative"}>
        <CardHeader>
            <HStack spacing={"6"} align={"center"}>
                <Avatar size={"lg"} src={user.avatarUrl ?? undefined}/>
                <VStack align={"start"}>
                    <Heading size={"sm"}>{user.name}</Heading>
                    <HStack spacing={"4"}>
                        <Rating rating={review.rating} />
                        <Heading size={"md"}>{review.title}</Heading>
                    </HStack>
                </VStack>
            </HStack>
        </CardHeader>

        <CardBody>
            {review.description}
        </CardBody>

        <Text fontSize={"sm"} pos={"absolute"} bottom={"3"} right={"4"}>
            Added on {new Date(review.createdAt).toLocaleDateString()}
        </Text>
    </Card>;
};

export const SessionUserReviewCard: React.FC<Props> = ({ review }) => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();

    if (!user) return <ReviewCardSkeleton />;

    return <Card w="full" variant={"outline"} borderRadius={"lg"} pos={"relative"}>
        <CardHeader>
            <HStack spacing={"6"} align={"center"}>
                <Avatar size={"lg"} src={user.avatarUrl ?? undefined}/>
                <VStack align={"start"}>
                    <Heading size={"sm"}>{user.name}</Heading>
                    <HStack spacing={"4"}>
                        <HStack>
                            {Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) =>
                                <Text key={i} color={i < review.rating ? "green.300" : "gray.400"}>
                                    <FaStar/>
                                </Text>,
                            )}
                        </HStack>
                        <Heading size={"md"}>{review.title}</Heading>
                    </HStack>
                </VStack>
            </HStack>
        </CardHeader>

        <CardBody>
            {review.description}
        </CardBody>

        <Text fontSize={"sm"} pos={"absolute"} bottom={"3"} right={"4"}>
            Added on {new Date(review.createdAt).toLocaleDateString()}
        </Text>

        <Button
            leftIcon={<FaPen />}
            pos={"absolute"}
            top={"3"}
            right={"4"}
            size={"sm"}
            onClick={() => dispatch(openModal("editReview"))}
        >Edit Review
        </Button>
    </Card>;
};

const ReviewCardSkeleton: React.FC = () => {
    return <Card variant={"outline"} w={"full"}>
        <CardBody>
            <HStack spacing={"6"}>
                <SkeletonCircle size={"24"} />
                <VStack spacing={"4"} align={"start"}>
                    <Skeleton h={"6"} w={"56"} />
                    <Skeleton h={"6"} w={"72"} />
                </VStack>
            </HStack>
            <VStack mt={"6"} w={"full"} align={"start"}>
                <Skeleton h={"6"} w={"full"} />
                <Skeleton h={"6"} w={"3xl"} />
            </VStack>
        </CardBody>
    </Card>;
};