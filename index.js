const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2zvoo0z.mongodb.net/?retryWrites=true&w=majority`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {



        const userCollection = client.db("taskManagement").collection("users")
        const taskCollection = client.db("taskManagement").collection("task")


        // users related
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { userMail: user.userMail }
            const existingUser = await userCollection.findOne(query)
            if (existingUser) {
              return res.send({ message: 'user already exist', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result)
          })



        //   task related
        app.post('/create-task', async (req, res) => {
            const task = req.body
            const result = await taskCollection.insertOne(task)
            res.send(result);
          })

          app.get('/my-task', async (req, res) => {
            let query = {}
      
            if (req.query?.email) {
              query = {
                'author.email': req.query.email,
              }
              const result = await taskCollection.find(query).toArray();
              res.send(result)
            }
      
          })

          app.patch('/update-task-status/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id,req.body)
            const filter = { _id: new ObjectId(id) };
            const updateStatus = req.body;
            console.log(updateStatus.status)
          
            const updatedDoc = {
              $set: {
                status : updateStatus.status
              },
          };
          const result = await taskCollection.updateOne(filter,updatedDoc)
          res.send(result);
          });
          


          app.get('/task',async(req,res)=>{
            const result = await taskCollection.find().toArray();
            res.send(result)
          })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('task management ')
})

app.listen(port, () => {
    console.log(`task management running on ${port}`)
})