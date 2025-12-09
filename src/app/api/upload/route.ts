import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);

      await writeFile(filepath, buffer);

      // Convert to relative URL path
      const relativePath = `/uploads/${filename}`;
      imageUrls.push(relativePath);
    }

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Error uploading files', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
