const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.cloud_name;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.api_key;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.api_secret;

if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
} else {
    console.warn("Cloudinary env vars are missing. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to enable image uploads.");
}

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "wanderlust",
        allowedFormats: ["jpeg", "png", "jpg"],
    },
});

module.exports = {
    cloudinary,
    storage,
    upload: multer({ storage }),
};