const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON

// In-memory book collection
let books = [
  { id: 1, title: "Hes into Her", author: "Maxinejiji" },
  { id: 2, title: "My Husband is a Mafia Boss", author: "Yanalovesyou" },
  { id: 3, title: "The Four Bad Boys and Me", author: "Blue_Maiden" }
];

// Route: GET /
app.get('/', (req, res) => {
  res.send("Simple Book API using Node.js and Express");
});

// Route: GET /api/books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Route: GET /api/books/:id
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

// Route: POST /api/books
app.post('/api/books', (req, res) => {
  const { title, author } = req.body;
  const newBook = {
    id: books.length + 1,
    title,
    author
  };

  books.push(newBook);
  res.json(`Book Added.`);
});

// Route: PATCH /api/books/:id
app.patch('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;

  res.json(`Book with ID ${id} has been updated.`);
});

// Route: DELETE /api/books/:id
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);
  res.json( `Book with ID ${id} has been deleted.`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
