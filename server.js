const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory book collection
let books = [
  { id: 1, title: "Hes into Her", author: "Maxinejiji" },
  { id: 2, title: "My Husband is Mafia", author: "Yanalovesyouu" },
  { id: 3, title: "The Four Bad Boys and Me", author: "Blue_Maiden" }
];

// Route : Simple welcome message
app.get('/', (req, res) => {
  res.send("Simple Book API using Node.js and Express");
});

// Route : Return full List of books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Route : Return the details of a single book by its ID.   
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

// Route : Add a new book to the collection
app.post('/api/books', (req, res) => {
  const { title, author } = req.body;

  const newBook = {
    id: books.length + 1  ,
    title,
    author
  };

  books.push(newBook);
  res.status(201).json("Book added!");
});

// Route : Update the title and/or author of a specific book.
app.patch('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;

  res.json({ message: `Book with ID ${id} is updated` });
});

// Route : Remove a book from the collection by ID.
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);
  res.json({ message: `Book with ID ${id} is deleted` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
