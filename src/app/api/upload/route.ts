import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

const firebaseConfig = {
  apiKey: "AIzaSyDGeZh16k85pSblnFf0QYyF_3ENtliYWK4",
  authDomain: "my-shop-2c7ed.firebaseapp.com",
  projectId: "my-shop-2c7ed",
  storageBucket: "my-shop-2c7ed.firebasestorage.app",
  messagingSenderId: "942958259544",
  appId: "1:942958259544:web:cfdcd99b53ce7a7207892d",
  measurementId: "G-3D0HZ0DJ7C"
};

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: firebaseConfig.projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: firebaseConfig.storageBucket,
  });
}

const bucket = getStorage().bucket();

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
    }

    // Upload files in parallel for better performance
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      const fileRef = bucket.file(`uploads/${filename}`);

      // Upload to Firebase Storage
      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type,
        },
        public: true,
      });

      // Get the public URL
      const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2491', // Far future date for permanent access
      });

      return url;
    });

    // Wait for all uploads to complete
    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Error uploading files', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
