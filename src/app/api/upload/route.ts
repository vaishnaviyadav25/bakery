import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const imageUrls: string[] = [];

    form.on('file', (field, file) => {
      // Convert absolute path to relative URL path
      const relativePath = file.filepath.replace(process.cwd() + '/public', '');
      imageUrls.push(relativePath);
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ message: 'Error uploading files', error: err.message });
      }

      res.status(200).json({ imageUrls });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error });
  }
}
