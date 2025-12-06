import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export async function POST(request: NextRequest): Promise<Response> {
  try {
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      multiples: true,
    });

    return new Promise((resolve) => {
      form.parse(request as any, async (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          resolve(NextResponse.json({ error: 'Failed to parse form' }, { status: 400 }));
          return;
        }

        try {
          const imageUrls: string[] = [];

          // Handle multiple files
          const images = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);

          for (const file of images) {
            if (file && file.filepath) {
              // Upload to Cloudinary
              const result = await cloudinary.uploader.upload(file.filepath, {
                folder: 'bakery-products',
              });

              // Add Cloudinary URL to array
              imageUrls.push(result.secure_url);

              // Clean up local file
              await fs.unlink(file.filepath);
            }
          }

          resolve(NextResponse.json({
            success: true,
            imageUrls,
            message: `Successfully uploaded ${imageUrls.length} image(s)`
          }));

        } catch (error) {
          console.error('File processing error:', error);
          resolve(NextResponse.json({ error: 'Failed to process files' }, { status: 500 }));
        }
      });
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
