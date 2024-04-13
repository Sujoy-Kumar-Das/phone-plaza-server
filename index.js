const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("phonePlaza");
    const heroItems = db.collection("heroItems");
    const flashSales = db.collection("flashSales");
    const categories = db.collection("categories");

    app.get("/hero-items", async (req, res) => {
      const result = await heroItems.find({}).toArray();
      res.json({
        success: true,
        message: "Hero item fetched successfully",
        data: result,
      });
    });

    app.get("/flash-sale", async (req, res) => {
      const limit = Number(req.query.limit);

      if (!limit) {
        const result = await flashSales
          .find({ flashSale: true })
          .sort({ ratting: -1 })
          .toArray();
      }

      const result = await flashSales
        .find({ flashSale: true })
        .sort({ ratting: -1 })
        .limit(limit)
        .toArray();
      res.json({
        success: true,
        message: "Flash sale products fetched successfully",
        data: result,
      });
    });

    app.get("/categories", async (req, res) => {
      let result;
      const category = req.query.category;
      if (category) {
        result = await flashSales
          .find({ brand: { $regex: new RegExp(category, "i") } })
          .toArray();
      }

      if (!category) {
        result = await categories.find({}).sort({ _id: -1 }).toArray();
      }

      res.json({
        success: true,
        message: "categories fetched successfully",
        data: result,
      });
    });

    app.get("/products", async (req, res) => {
      const limit = Number(req.query.limit);

      if (!limit) {
        const result = await flashSales
          .find({})
          .sort({ ratting: -1 })
          .toArray();
      }

      const result = await flashSales
        .find({})
        .sort({ ratting: -1 })
        .limit(limit)
        .toArray();

      res.json({
        success: true,
        message: "products fetched successfully",
        data: result,
      });
    });

    app.get("/products/:id", async (req, res) => {
      const result = await flashSales.findOne({
        _id: new ObjectId(req.params.id),
      });

      res.json({
        success: true,
        message: "product is fetched successfully",
        data: result,
      });
    });
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
