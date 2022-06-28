require("dotenv").config();

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;

async function main() {
  console.log("Connecting to database...");

  // Database connection
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  const collection = db.collection("heroes");

  console.log("Connection successfully done");

  const app = express();

  // Set JSON as default for requests' body
  app.use(express.json());

  app.get("/", function (req, res) {
    res.send("Hello, Stranger! Hello, Gorgeous!");
  });

  // Endpoint Read All - [GET] /heroes
  app.get("/heroes", async function (req, res) {
    const documents = await collection.find().toArray();
    res.send(documents);
  });

  // Endpoint Read by ID - [GET] /heroes/:id
  app.get("/heroes/:id", async function (req, res) {
    const id = req.params.id;
    const item = await collection.findOne({ _id: new ObjectId(id) });

    res.send(item);
  });

  // Endpoint Create - [POST] /heroes
  app.post("/heroes", async function (req, res) {
    // Get hero name from request body
    const item = req.body;

    // Insert the object in the collection
    await collection.insertOne(item);

    res.send(item);
  });

  // Endpoint Update - [PUT] /heroes/:id
  app.put("/heroes/:id", async function (req, res) {
    // Get ID from route
    const id = req.params.id;

    // Got name sent in the request body
    const item = req.body;

    // Updating collection by id
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: item }
      );

    res.send(item);
  });

  // Endpoint Delete - [DELETE] /heroes/:id
  app.delete("/heroes/:id", async function (req, res) {
    // Get ID from route
    const id = req.params.id;

    // Deleting item in the id position -1 from the list
    await collection.deleteOne({ _id: new ObjectId(id) });

    res.send("Item successfully deleted!");
  });

  app.listen(process.env.PORT || process.env.DB_PORT, () =>
    console.log("Server running at MongoDB Cloud")
  );
}

main();
