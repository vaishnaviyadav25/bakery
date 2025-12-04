import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      multiples: true,
    });

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
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
              // Generate unique filename
              const timestamp = Date.now();
              const random = Math.random().toString(36).substr(2, 9);
              const ext = path.extname(file.originalFilename || 'image.jpg');
              const filename = `v${timestamp}${random}${ext}`;

              const newPath = path.join(uploadDir, filename);

              // Move file to new location
              await fs.rename(file.filepath, newPath);

              // Add to URLs array
              imageUrls.push(`/uploads/${filename}`);
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
