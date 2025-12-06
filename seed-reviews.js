require('dotenv').config({ path: './.env' });
const { MongoClient } = require('mongodb');

async function seedReviews() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('meetbakery');
    const collection = db.collection('reviews');

    // Check if data already exists
    const existing = await collection.find({}).toArray();
    if (existing.length > 0) {
      console.log('Reviews already exist');
      return;
    }

    const reviews = [
      { text: "The chocolate cake was absolutely divine — moist and rich!", name: "Varsha", rating: 5, createdAt: new Date() },
      { text: "The vanilla cupcakes were perfectly baked and so delicious!", name: "Gaytri", rating: 5, createdAt: new Date() },
      { text: "Loved the blueberry muffins — fresh and fluffy!", name: "Riya", rating: 5, createdAt: new Date() },
      { text: "Amazing packaging and fast delivery! Definitely ordering again 💕", name: "Sneha", rating: 5, createdAt: new Date() },
      { text: "The red velvet cake made my birthday unforgettable ✨", name: "Prachi", rating: 5, createdAt: new Date() },
      { text: "Beautiful presentation — every treat is perfect ❤️", name: "Ananya", rating: 5, createdAt: new Date() },
    ];

    const result = await collection.insertMany(reviews);
    console.log(`${result.insertedCount} reviews inserted`);
  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    await client.close();
  }
}

seedReviews();
