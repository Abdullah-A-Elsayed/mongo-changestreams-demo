const { connectToDatabase, client } = require("./db");

async function addInventoryItems() {
  const db = await connectToDatabase();
  const inventory = db.collection("inventory");

  const items = [
    { name: "Laptop", count: 5, price: 999.99 },
    { name: "Smartphone", count: 10, price: 599.99 },
    { name: "Headphones", count: 15, price: 99.99 },
    { name: "Tablet", count: 8, price: 399.99 },
  ];

  try {
    const result = await inventory.insertMany(items);
    console.log(`Successfully inserted ${result.insertedCount} items`);
  } catch (error) {
    console.error("Error inserting items:", error);
  } finally {
    await client.close();
  }
}

addInventoryItems();
