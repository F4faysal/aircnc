const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;


// ACCESS_TOCKEN = 347812648723472D21371872FAB

// middlewares
app.use(cors());
app.use(express.json());

// Database Connection
//C0FZM8Q3Cs8D76Sd
//aircncdb

const uri =
  "mongodb+srv://aircncdb:C0FZM8Q3Cs8D76Sd@cluster0.0t7ovhi.mongodb.net/?retryWrites=true&w=majority";

// const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const homesCollection = client.db("aircncdb").collection("homes");
    const usersCollection = client.db("aircncdb").collection("users");

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);

      console.log('result ',result);

      const token = jwt.sign(user, process.env.ACCESS_TOCKEN, {
        expiresIn: "1d",
      });
      console.log('token ',token);
      res.send({ result, token });
    });
    console.log("Database Connected...");
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`);
});
