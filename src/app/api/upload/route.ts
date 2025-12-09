import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import { v2 as cloudinary } from "cloudinary";

// Disable default body parsing (required for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResponse {
  imageUrls: string[];
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse | { message: string; error?: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ message: "Error parsing form", error: err.message });
      }

      const uploadedFiles = files.images as File[] | File;
      if (!uploadedFiles) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
      const imageUrls: string[] = [];

      try {
        // Upload each file to Cloudinary
        for (const file of fileArray) {
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: "products", // Optional folder
          });
          imageUrls.push(result.secure_url);
        }

        return res.status(200).json({ imageUrls });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Error uploading to Cloudinary",
          error: (uploadError as Error).message,
        });
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Error uploading files", error: (error as Error).message });
  }
}
