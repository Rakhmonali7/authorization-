// Import the Express framework to create a web server.
const express = require('express');
// Import the MongoDB client to connect to a MongoDB database.
const { MongoClient } = require('mongodb');

// Create an instance of the Express application.
const app = express();
// Declare a variable to hold the reference to the MongoDB database.
let db;

// Define an asynchronous function to start the server and connect to the database.
async function startServer() {
  try {
    // Attempt to connect to the MongoDB database.
    const client = await MongoClient.connect(
      'mongodb://localhost:27017/bookstore'
    );
    // If the connection is successful, log the client object.
    console.log(client);
    // Get a reference to the database from the client.
    db = client.db();

    // Start the Express server and make it listen on port 3000.
    app.listen(3000, () => {
      console.log('app listening on port 3000');
    });
  } catch (err) {
    // If there's an error connecting to the database, log the error.
    console.error('Failed to connect to the database:', err);
  }
}

// Call the function to start the server and connect to the database.
startServer();

// Define a route for the root URL ('/') of the web server.
// When someone accesses the root URL in a web browser,
// the server will respond with a JSON message.
app
  .get('/books', (req, res) => {
    let books = [];
    db.collection('books')
      .find()
      .sort({ author: 1 })
      .forEach(book => {
        books.push(book);
      })
      .then(() => res.status(200).json(books));
  })
  .catch(() => {
    res.status(500).json({ err: 'Could not fetch document' });
  });
