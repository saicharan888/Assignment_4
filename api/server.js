/* eslint linebreak-style: ["error", "windows"] */

/* eslint no-restricted-globals: "off" */

const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://saicharan45:Katta1995@fullstackcluster0-kvjcb.mongodb.net/ProductList?retryWrites=true&w=majority';
const portServer = process.env.API_SERVER_PORT || 3000;

let db;

async function productList() {
  const products = await db.collection('products').find({}).toArray();
  console.log(products);
  return products;
}
async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function addProduct(_, { product }) {
  const productNew = { ...product };
  console.log('Added new product to inventory');
  productNew.id = await getNextSequence('products');
  const result = await db.collection('products').insertOne(productNew);
  const finalProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return finalProduct;
}

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    addProduct,
  },
};

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });
(async function start() {
  try {
    await connectToDb();
    app.listen(portServer, () => {
      console.log(`API started on port ${portServer}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
