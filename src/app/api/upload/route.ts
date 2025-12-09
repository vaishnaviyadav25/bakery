import { NextRequest, NextResponse } from "next/server";
import formidable, { File } from "formidable";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  // Wrap formidable in a promise
  const data = await new Promise<{ files: File[]; error?: any }>((resolve) => {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    form.parse(req as any, (err, fields, files) => {
      if (err) resolve({ files: [], error: err });
      else {
        const uploadedFiles = files.images
          ? Array.isArray(files.images)
            ? files.images
            : [files.images]
          : [];
        resolve({ files: uploadedFiles });
      }
    });
  });

  if (data.error) {
    return NextResponse.json(
      { message: "Form parse error", error: data.error.message },
      { status: 500 }
    );
  }

  if (data.files.length === 0) {
    return NextResponse.json({ message: "No files uploaded" }, { status: 400 });
  }

  try {
    const imageUrls: string[] = [];
    for (const file of data.files) {
      const result = await cloudinary.uploader.upload(file.filepath, { folder: "products" });
      imageUrls.push(result.secure_url);
    }

    return NextResponse.json({ imageUrls });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Cloudinary upload failed", error: err.message },
      { status: 500 }
    );
  }
}
