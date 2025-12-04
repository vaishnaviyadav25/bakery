require('dotenv').config();
const { MongoClient } = require('mongodb');

const bakeryProducts = [
  {
    id: 11,
    category: "PLUM CAKE",
    name: "Premium Rich Plum Cake",
    price: 60,
    images: ["/2.jpeg", "/3.jpeg"],
    desc: "Delicious premium rich plum cake made with finest ingredients — perfect for celebrations or gifting 🎂",
    material: "Fresh fruits, nuts, and premium flour",
    size: "500g",
    care: "Store in cool place. Consume within 7 days.",
  },
  {
    id: 12,
    category: "PLUM CAKE",
    name: "Dry Fruit Plum Cake",
    price: 80,
    images: ["/4.jpeg", "/save.jpeg"],
    desc: "Rich plum cake loaded with dry fruits — a festive favorite for special occasions ✨",
    material: "Mixed dry fruits, premium flour, and natural flavors",
    size: "500g",
    care: "Store in cool place. Consume within 7 days.",
  },
  {
    id: 13,
    category: "PATISSERIE CAKES",
    name: "Classic Fresh Cream Cake",
    price: 50,
    images: ["/WhatsApp Image 2025-12-03 at 3.00.50 PM.jpeg"],
    desc: "Light and fluffy fresh cream cake — perfect for birthdays and celebrations 🎉",
    material: "Fresh cream, premium flour, and natural flavors",
    size: "1kg",
    care: "Refrigerate. Consume within 2 days.",
  },
  {
    id: 14,
    category: "PATISSERIE CAKES",
    name: "Belgian Chocolate Truffle Cake",
    price: 80,
    images: ["/WhatsApp Image 2025-12-03 at 3.00.49 PM.jpeg"],
    desc: "Decadent Belgian chocolate truffle cake — a chocolate lover's dream 🍫",
    material: "Belgian chocolate, fresh cream, and premium ingredients",
    size: "1kg",
    care: "Refrigerate. Consume within 2 days.",
  },
  {
    id: 15,
    category: "BROWNIES",
    name: "Classic Fudge Brownie",
    price: 80,
    images: ["/WhatsApp Image 2025-12-03 at 3.00.49 PM (1).jpeg"],
    desc: "Rich and fudgy classic brownie — perfect with coffee or as a snack ☕",
    material: "Premium chocolate, flour, and fresh ingredients",
    size: "2 pieces",
    care: "Store in cool place. Consume within 5 days.",
  },
  {
    id: 16,
    category: "CUPCAKES MENU",
    name: "Classic Vanilla Cupcake",
    price: 60,
    images: ["/image.jpeg"],
    desc: "Delicious vanilla cupcakes — soft, fluffy, and perfect for any occasion 🧁",
    material: "Vanilla extract, premium flour, and fresh cream",
    size: "4 pieces",
    care: "Store in cool place. Consume within 3 days.",
  },
  {
    id: 17,
    category: "COOKIES",
    name: "Chocolate Chip Cookies",
    price: 120,
    images: ["/logo.jpeg"],
    desc: "Crunchy chocolate chip cookies — a classic treat for all ages 🍪",
    material: "Premium chocolate chips, flour, and butter",
    size: "Pack of 6",
    care: "Store in airtight container. Consume within 7 days.",
  },
  {
    id: 18,
    category: "CHEESE CAKE",
    name: "Classic New York Cheesecake",
    price: 110,
    images: ["/bakerylogo.png"],
    desc: "Creamy New York style cheesecake — rich and indulgent dessert 🧀",
    material: "Cream cheese, graham cracker crust, and fresh fruits",
    size: "500g",
    care: "Refrigerate. Consume within 3 days.",
  },
];

async function seedBakeryProducts() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('meetbakery');
    const collection = database.collection('products');

    // Insert the bakery products (without clearing existing ones)
    const result = await collection.insertMany(bakeryProducts);
    console.log(`${result.insertedCount} bakery products inserted successfully`);

  } catch (error) {
    console.error('Error seeding bakery products:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedBakeryProducts();
