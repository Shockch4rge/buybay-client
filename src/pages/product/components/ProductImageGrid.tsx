import { useState } from "react";
import { AspectRatio, Grid, GridItem, Image, Link, Text } from "@chakra-ui/react";

export const ProductImageGrid: React.FC<{ urls: string[] }> = ({ urls }) => {
    const [index, setIndex] = useState(0);

    return <Grid
        w={{ base: "full", lg: "96" }}
        templateRows={{ base: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
        templateColumns={{ base: "repeat(5, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={"4"}
        placeItems={"center stretch"}
    >
        <GridItem rowSpan={{ base: 2, lg: 3 }} colSpan={{ base: 2, lg: 3 }}>
            <AspectRatio ratio={1}>
                <Image src={urls[index]} borderRadius={"md"} draggable={false} />
            </AspectRatio>
        </GridItem>
        {urls.map((url, i) =>
            <GridItem
                key={`product-image-carousel-${i}-${url}`}
                rowSpan={1}
                colSpan={1}
                onClick={() => setIndex(i)}>
                <Link>
                    <AspectRatio
                        ratio={1}
                        borderColor={index === i ? "green.300" : "gray.50"}
                        borderWidth={"thick"}
                        borderRadius={"md"}
                    >
                        <Image src={url} draggable={false}/>
                    </AspectRatio>
                </Link>
            </GridItem>,
        )}
        {urls.length > 3 &&
            <GridItem rowSpan={1} colSpan={1}>
                <Text textAlign={"center"} fontWeight={"bold"}>...and {urls.slice(6).length} more</Text>
            </GridItem>
        }
    </Grid>;
};