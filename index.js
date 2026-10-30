import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-1igpkzg-shard-00-00.o6diijd.mongodb.net:27017,ac-1igpkzg-shard-00-01.o6diijd.mongodb.net:27017,ac-1igpkzg-shard-00-02.o6diijd.mongodb.net:27017/?ssl=true&replicaSet=atlas-gtuaj4-shard-0&authSource=admin`,
);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

const connectedClient = await connectToMongoDB();

const database = connectedClient.db("server_2");
const users = database.collection("users");

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.get("/users", async (req, res) => {
  const cursor = users.find();
  const allUsers = await cursor.toArray();
  res.send(allUsers);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
