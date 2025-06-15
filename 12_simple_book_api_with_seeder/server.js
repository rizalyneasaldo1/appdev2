const express = require('express');
const mongoose = require('mongoose');
const authenticateToken = require('./middlewares/jwt-auth');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bookRouter = require('./routers/book-router');
const authRouter = require('./routers/auth-router');

app.use('/api/auth', authRouter);
app.use('/api/books', authenticateToken, bookRouter);

app.get('/', (req, res) => {
  res.send('Simple Book API using Node.js and Express');
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });


