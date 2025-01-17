const mongoose = require("mongoose");
const Item = require("../models/clothingItem.js"); // Ensure this path and model name are correct

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/itemsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedItems = async () => {
  const items = [
    {
      name: "Cap",
      weather: "hot",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png?etag=f3dad389b22909cafa73cff9f9a3d591",
    },
    {
      name: "Hoodie",
      weather: "warm",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Hoodie.png?etag=5f52451d0958ccb1016c78a45603a4e8",
    },
    {
      name: "Jacket",
      weather: "cold",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jacket.png?etag=f4bb188deaa25ac84ce2338be2d404ad",
    },
    {
      name: "Sneakers",
      weather: "cold",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sneakers.png?etag=3efeec41c1c78b8afe26859ca7fa7b6f",
    },
    {
      name: "T-Shirt",
      weather: "hot",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/T-Shirt.png?etag=44ed1963c44ab19cd2f5011522c5fc09",
    },
    {
      name: "Coat",
      weather: "cold",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Coat.png?etag=298717ed89d5e40b1954a1831ae0bdd4",
    },
  ];

  try {
    await Item.insertMany(items);
    console.log("Items seeded successfully");
  } catch (error) {
    console.error("Error seeding items:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedItems();
