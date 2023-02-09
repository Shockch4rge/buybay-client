const debounce = (fn: (...args: any[]) => any, delay : number) => {
    let timeout: any;

    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

const compress = async (image: File) => {
    if (image.type !== "image/jpeg" && image.type !== "image/jpg" && image.type !== "image/png") {
        throw new Error("Image must be a JPEG or PNG");
    }

    const imageBitmap = await createImageBitmap(image);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageBitmap, 0, 0);

    // Turn into Blob
    const blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob(
            blob => blob ? res(blob) : rej(new Error("Could not compress image")),
            "image/jpeg",
            0.5,
        );
    });

    // Turn Blob into File
    return new File([blob], image.name, {
        type: blob.type,
    });
};

export default {
    debounce,
    compress,
};