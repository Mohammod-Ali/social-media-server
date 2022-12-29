const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express()

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7haskyh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const postCollection = client.db('mediaBook').collection('postCollection')
        const aboutCollection = client.db('mediaBook').collection('aboutCollection')

        app.get('/post', async(req, res) => {
            const query = {}
            const options = await postCollection.find(query).toArray()
            res.send(options)
        })

        app.post('/aboutModal', async(req, res) => {
            const about = req.body;
            console.log(about)
            const filter = {}
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: about.name,
                    email: about.email,
                    university: about.university,
                    address: about.address
                }
            }
            const result = await aboutCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(console.log)

app.get('/', async(req, res) => {
    res.send('MediaBook server is running')
})

app.listen(port, () => console.log(`MediaBook Running on ${port}`))