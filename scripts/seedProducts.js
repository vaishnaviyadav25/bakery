const { MongoClient } = require('mongodb');

const hardcodedProducts = [
  {
    id: 1,
    category: "Macramé",
    name: "Macramé sling Bag",
    price: 429,
    images: ["/Bag.jpeg", "/bag1.jpeg"],
    desc: "A cute handcrafted butterfly keychain made with love — perfect for bags, keys, or gifting 💖",
    material: "Premium cotton macramé thread",
    size: "10 cm x 6 cm",
    care: "Wipe gently with a dry cloth. Avoid moisture.",
  },
  {
    id: 2,
    category: "Macramé",
    name: "Macramé Butterfly",
    price: 299,
    images: ["/Butterflies.jpeg", "/Butterflies1.jpeg"],
    desc: "A cute handcrafted butterfly keychain made with love — perfect for bags, keys, or gifting 💖 , Set of 3 ",
    material: "Premium cotton macramé thread",
    size: "10 cm x 6 cm",
    care: "Wipe gently with a dry cloth. Avoid moisture.",
  },
  {
    id: 3,
    category: "Beaded Art 🎨 ",
    name: "Colorful Beaded Keychain",
    price: 159,
    images: ["/beadskeychain.jpeg","/beadskeychain1.jpeg"],
    desc: "Vibrant handmade beaded keychain — a perfect accessory for bags, keys, or as a thoughtful gift.",
    material: "Durable high-quality beads and thread",
    size: "Free size",
    care: "Keep away from water and sharp objects to maintain its shine and shape.",
  },
  {
    id: 4,
    category: "Beaded Art 🎨 ",
    name: "Beaded Bow Keychain",
    price: 159,
    images: ["/Key.jpeg"],
    desc: "Handcrafted beaded keychain — colorful, durable, and perfect as a gift or accessory.",
    material: "High-quality beads and thread",
    size: "Free size",
    care: "Avoid water and handle gently to maintain durability.",
  },
  {
    id: 5,
    category: "Beaded Art 🎨 ",
    name: "Handmade Beaded Bracelet",
    price: 99,
    images: ["/bracelet.jpeg"],
    desc: "Beautiful handmade beaded bracelet — perfect for daily wear or gifting to loved ones.",
    material: "High-quality beads with elastic thread",
    size: "Free size, stretches to fit most wrists",
    care: "Avoid water and harsh chemicals to keep beads bright and elastic intact.",
  },
  {
    id: 6,
    category: "Beaded Art 🎨 ",
    name: "Aesthetic beads phone charms",
    price: 99,
    images: ["/minicharm.jpeg", "/minicharm1.jpeg"],
    desc: "Adorable mini phone charm featuring a cute penguin — a charming accessory to brighten up any phone.",
    material: "High-quality beads with elastic thread",
    size: "Free size, stretches to fit most wrists",
    care: "Avoid water and harsh chemicals to keep beads bright and elastic intact.",
  },
  {
    id: 7,
    category: "Beaded Art 🎨 ",
    name: "Aesthetic beads phone charms",
    price: 99,
    images: ["/cherry.jpeg", "/cherry1.jpeg"],
    desc: "Adorable mini phone charm featuring a cute cherry — a charming accessory to brighten up any phone.",
    material: "High-quality beads with elastic thread",
    size: "Free size, stretches to fit most wrists",
    care: "Avoid water and harsh chemicals to keep beads bright and elastic intact.",
  },
  {
    id: 8,
    category: "Embriodery Art 🧶",
    name: " Hair Clips",
    price: 99,
    images: [
      "https://m.media-amazon.com/images/I/81AEWV7bQxL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81dHQ1htg6L._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71qp5fyjU2L._SL1500_.jpg",
    ],
    desc: "Red  and white  small rose — lightweight and elegant.(Set of 2)",
    material: "cotton cloth",
    size: "Free size",
    care: "Dry clean only.",
  },
  {
    id: 9,
    category: "Embriodery Art 🧶",
    name: " Hair Clips",
    price: 99,
    images: ["/rose1.jpeg", "/rose.jpeg"],
    desc: "Hand-made hair clip . Beautiful flowers and leaves -- lightweight  and elegant.(Set of 2)",
    material: "cotton cloth ",
    size: "Free size",
    care: "Dry clean only.",
  },
  {
    id: 10,
    category: "Potli bags",
    name: " Potli",
    price: 99,
    images: ["/potli.jpeg", "/potli1.jpeg", "/potli3.jpeg"],
    desc: "Elegant handmade potli bag — perfect for festive occasions, weddings, or gifting loved ones.",
    material: "cotton cloth ",
    size: "Free size",
    care: "Dry clean only.",
  },
];

async function seedProducts() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('business');
    const collection = database.collection('products');

    // Clear existing products (optional)
    await collection.deleteMany({});

    // Insert the hardcoded products
    const result = await collection.insertMany(hardcodedProducts);
    console.log(`${result.insertedCount} products inserted successfully`);

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();
