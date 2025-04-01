// test-cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY?.substring(0, 3) + "...",
});

// Test with a simple ping
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("Cloudinary Error:", error);
  } else {
    console.log("Cloudinary Success:", result);
  }
});