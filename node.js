
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'cyberassist';
const collectionName = process.env.MONGODB_COLLECTION || 'users';
if (!uri) {
  throw new Error('Missing MONGODB_URI in environment. Add it to your .env file.');
}

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection on the intended database
    const db = client.db(dbName);
    await db.command({ ping: 1 });
    const collection = db.collection(collectionName);
    console.log(`Pinged your deployment and verified the '${dbName}' database connection using the '${collectionName}' collection.`);
    console.log(`Resolved collection: ${collection.namespace}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
