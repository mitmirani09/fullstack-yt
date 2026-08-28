import { v2 as cloudinary } from "cloudinary"
import { unlinkSync } from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;

        // uploading on cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })

        console.log(`file upload completed: ${response} , url: ${response.url}`)
        return response;

    } catch (error) {
        unlinkSync(filePath); // on error removing the temp saved file
        return null;
    }
}

export { uploadOnCloudinary }