const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sjgil1q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const userCollection = client.db("Stylify").collection("user_collection");
    const categoryCollection = client.db("Stylify").collection("products_category");
    const categoryProductCollection = client.db("Stylify").collection("products");

  console.log('database connected');

  app.get("/user/:email", async (req, res) => {
    const email= req.params.email;
    const result = await userCollection.findOne(email);
    res.send(result);
  });

  app.get("/users", async (req, res) => {
    const cursor = userCollection.find({});
    const users = await cursor.toArray();
    res.send(users);
  });

  app.get ('/categories', async(req, res) =>{
    const categoryData = categoryCollection.find();
    const result = await categoryData.toArray();
    res.send(result);
  });

  app.get("/products", async (req, res) => {
    const cursor = categoryProductCollection.find({});
    const products = await cursor.toArray();
    res.send(products);
  });

  app.get("/products/category/:id", async (req, res) => {
    const id = req.params.id;
    const query = {};
    const products = await categoryProductCollection.find(query).toArray();
    const category_products = products.filter((p) => p.category_id === id);
    res.send(category_products);
  });

  
  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const product = await categoryProductCollection.findOne(query);
    res.send(product);
  });

  } finally {
  }
}
run().catch(console.log);

app.listen(port, () =>{
     console.log(`server running on port: ${port}`)
});