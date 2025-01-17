const mongoose = require("mongoose");
const Item = require("../models/clothingItem.js");

mongoose.connect("mongodb://localhost:27017/itemsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedItems = async () => {
  const items = [
    { name: "Item 1", description: "Description for item 1", price: 10 },
    { name: "Item 2", description: "Description for item 2", price: 20 },
    { name: "Item 3", description: "Description for item 3", price: 30 },
  ];

  try {
    await Item.insertMany(items);
    console.log("Items seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding items:", error);
    mongoose.connection.close();
  }
};

seedItems();
