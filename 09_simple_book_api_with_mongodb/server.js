const express = require('express');
const mongoose = require ('mongoose');
const bookRouter = require ('./routers/book-router');
require ('dotenv').config();

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({extended:false}));
app.use('/api/books',bookRouter);

const PORT = process.env. PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;

// Route: GET /
app.get('/', (req, res) => {
  res.send("Simple Book API using Node.js and Express");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.log(error.message);
  });
