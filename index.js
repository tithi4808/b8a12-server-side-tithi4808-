const express = require('express')
const cors=require('cors')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.USERPASS}@cluster0.3vwvgpx.mongodb.net/?retryWrites=true&w=majority`;


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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    // const userEmail = 'admin@example.com';
    // const userPassword = 'adminpassword123';

    // const user = await admin.auth().getUserByEmail(userEmail).catch(() => null);

    // if (!user) {
    //   await admin.auth().createUser({
    //     email: userEmail,
    //     password: userPassword,
    //   });
    // }

    // const userRoles = await admin.auth().listUsers()
    // .then((users) => users.map((user) => ({ email: user.email, role: user.customClaims ? user.customClaims.role : null })))
    // .catch((error) => {
    //   console.error('Error fetching user roles:', error);
    //   return [];
    // });

    // app.get('/user-roles', (req, res) => {
    //   res.json(userRoles);
    // });


    const database1 = client.db("AllEmployees");
    const EmployeeCollection = database1.collection("allemployees");

    const database2= client.db("admins");
    const adminsCollection = database2.collection("admins");

    const database3= client.db("Fullteam");
    const FullteamCollection = database3.collection("Fullteam");

    const database4= client.db("AllAssets");
    const AllAssetsCollection = database4.collection("Allassets");

    const database5= client.db("Allrequests");
    const AllrequestCollection = database5.collection("Allrequest");


    app.get("/",async(req,res)=>{
        res.send('final effort server site')
    })

    app.post("/allemployees",async(req,res)=>{
      const newblogs=req.body
      const result = await EmployeeCollection.insertOne(newblogs);
      res.send(result)
    })

    app.patch("/fullteams/:email", async (req, res) => {
      try {
          const userEmail = req.params.email;
          const updatedData = req.body;
  
          const updatedUser = await FullteamCollection.findOneAndUpdate(
              { email: userEmail },
              { $set: updatedData },
              { returnDocument: 'after' }
          );
  
          res.json(updatedUser.value);  // Send the updated user data in the response
      } catch (error) {
          console.error("Error updating user data:", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  });
  
    // app.get('/requestassets', async (req, res) => {
    //   const { searchTerm } = req.query;
    //   let query = {};
    
    //   // If searchTerm is provided, add search conditions
    //   if (searchTerm) {
    //     query = {
    //       $or: [
    //         { 'Product_Name': { $regex: searchTerm, $options: 'i' } },
    //         { 'Email': { $regex: searchTerm, $options: 'i' } }
    //       ]
    //     };
    //   }
    
    //   const cursor = AllrequestCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    app.get('/requestassets', async (req, res) => {
      try {
          const { searchTerm, status, assetType } = req.query;
          let query = {};

          // If searchTerm is provided, add search conditions
          if (searchTerm) {
              query = {
                  $or: [
                      { 'Product_Name': { $regex: searchTerm, $options: 'i' } },
                      { 'Email': { $regex: searchTerm, $options: 'i' } }
                  ]
              };
          }

          // Add status and assetType filters if provided
          if (status) {
              query.Status = status;
          }
          if (assetType) {
              query.Asset_Type = assetType;
          }

          const cursor = AllrequestCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
      } catch (error) {
          console.error("Error fetching custom requests:", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  });


   // Assuming you have Express and MongoDB setup

// Your other imports and setup code...
//1
// app.get('/requestassets', async (req, res) => {
//   try {
//       const searchTerm = req.query.searchTerm || '';
//       const statusFilter = req.query.status || '';
//       const assetTypeFilter = req.query.assetType || '';

//       const filter = {};
//       if (searchTerm) {
//           filter.Product_Name = { $regex: new RegExp(searchTerm, 'i') };
//       }
//       if (statusFilter) {
//           filter.status = statusFilter;
//       }
//       if (assetTypeFilter) {
//           filter.Asset_Type = assetTypeFilter;
//       }

//       const data = await AllrequestCollection.find(filter).toArray();

//       res.json(data);
//   } catch (error) {
//       console.error("Error fetching data:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Your update route remains the same...

    

    app.post("/allassets",async(req,res)=>{
      const newblogs=req.body
      const result = await AllAssetsCollection.insertOne(newblogs);
      res.send(result)
    })

    app.post("/requestassets",async(req,res)=>{
      const newblogs=req.body
      const result = await AllrequestCollection.insertOne(newblogs);
      res.send(result)
    })

    app.put('/requestassets/:id', async (req, res) => {
      try {
        const requestId = req.params.id;
    
        const updatedRequest = await AllrequestCollection.findOneAndUpdate(
          { _id: new ObjectId(requestId) },
          { $set: { request_status: 'approved' } },
          { returnDocument: 'after' }
        );
    
        if (!updatedRequest) {
          return res.status(404).json({ error: 'Request not found' });
        }
    
        res.json(updatedRequest);
      } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    app.get('/requestassets/:id', async (req, res) => {

      const cursor=AllrequestCollection.find()
      const result = await cursor.toArray()
      res.send(result)
      
    });


    app.get('/allemployees', async(req, res) => {
      const cursor=EmployeeCollection.find()
      const result = await cursor.toArray()
      res.send(result) 
        
    });
    app.post("/admins/:id",async(req,res)=>{
      const newblogs=req.body
      console.log(newblogs)
      const id=req.params.id
      
      const result = await adminsCollection.insertOne(newblogs);
      res.send(result)
    })

    app.post("/fullteams",async(req,res)=>{
      const newblogs=req.body
      console.log(newblogs)
      
      
      const result = await FullteamCollection.insertOne(newblogs);
      res.send(result)
    })

    app.get('/admins', async(req, res) => {
      const cursor=adminsCollection.find()
      const result = await cursor.toArray()
      res.send(result) 
        
    });

    app.get('/fullteams', async(req, res) => {
      const cursor=FullteamCollection.find()
      const result = await cursor.toArray()
      res.send(result) 
        
    });

    app.delete("/requestassets/:_id",async(req,res)=>{
      const id=req.params._id
      
       const query = {_id:new ObjectId(id)}
       const result = await AllrequestCollection.deleteOne(query);
       res.send(result)

      
    })

    app.delete("/fullteams/:_id",async(req,res)=>{
      const id=req.params._id
      
       const query = {_id:new ObjectId(id)}
       const result = await FullteamCollection.deleteOne(query);
       res.send(result)

      
    })

   

    app.get('/allassets', async (req, res) => {
      try {
          const searchTerm = req.query.searchTerm || '';
          const availabilityFilter = req.query.availability || 'all';
          const assetTypeFilter = req.query.assetType || 'all';
          const sortBy = req.query.sortBy || 'none';
  
          const filter = {};

          if (searchTerm) {
            filter.$or = [
              { Product_Name: { $regex: searchTerm, $options: 'i' } },
              { Asset_Type: { $regex: searchTerm, $options: 'i' } },
            ];
          }
          
          if (availabilityFilter !== 'all') {
            filter.Product_Quantity = availabilityFilter === 'available' ? { $gt: 0 } : { $lte: 0 };
          }
          
          if (assetTypeFilter !== 'all') {
            filter.Asset_Type = { 
              $regex: assetTypeFilter === 'Returnable' ? 'Returnable' : 'NonReturn',
              $options: 'i'
            }}

            if (sortBy !== 'none') {
              const sortOrder = sortBy === 'asc' ? 1 : -1;
              cursor.sort({ Product_Quantity: sortOrder });
            }
          const cursor = AllAssetsCollection.find(filter);
          const result = await cursor.toArray();
          res.json(result);
      } catch (error) {
          console.error("Error fetching assets:", error);
          res.status(500).send("Internal Server Error");
      }
  });
  
  




    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})