import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string/meetbakery?retryWrites=true&w=majority';
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, displayName } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: 'UID and email are required' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('users');

    // Check if user already exists
    const existingUser = await collection.findOne({ uid });

    if (existingUser) {
      // Update existing user
      await collection.updateOne(
        { uid },
        {
          $set: {
            email,
            displayName: displayName || '',
            updatedAt: new Date(),
          },
        }
      );
      return NextResponse.json({ message: 'User updated successfully' });
    } else {
      // Create new user
      const newUser = {
        uid,
        email,
        displayName: displayName || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newUser);
      return NextResponse.json({ message: 'User created successfully', id: result.insertedId });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json({ error: 'Failed to save user' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('users');

    const users = await collection.find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json([], { status: 500 });
  } finally {
    await client.close();
  }
}
