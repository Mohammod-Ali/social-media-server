const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7haskyh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const postCollection = client.db("mediaBook").collection("postCollection");
    const commentCollection = client.db("mediaBook").collection("commentCollection");
    const aboutCollection = client
      .db("mediaBook")
      .collection("aboutCollection");

    // send the post data
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });

    // get the post data
    app.get("/posts", async (req, res) => {
      const query = {};
      const options = await postCollection.find(query).toArray();
      res.send(options);
    });

    // get the post details data
    app.get('/postdetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id)};
      const post = await postCollection.findOne(query);
      res.send(post);
    });

    // save comment to db
    app.post('/addcomment', async(req, res) => {
        const post = req.body;
        const result = await commentCollection.insertOne(post);
        res.send(result);
    })

    // get the comments data
    app.get('/comments', async(req, res) => {
        const query = {}
        const comment = await commentCollection.find(query).toArray()
        res.send(comment)
    })

    // update about data
    app.post("/aboutModal", async (req, res) => {
      const about = req.body;
      const filter = {};
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: about.name,
          email: about.email,
          university: about.university,
          address: about.address,
        },
      };
      const result = await aboutCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // get the about data
    app.get("/aboutdata", async (req, res) => {
      const query = {};
      const option = await aboutCollection.find(query).toArray();
      res.send(option);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("MediaBook server is running");
});

app.listen(port, () => console.log(`MediaBook Running on ${port}`));
