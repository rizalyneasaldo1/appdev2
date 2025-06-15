const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const User = require('../models/user.js'); 
const Book = require('../models/book-model.js');

//Connect to your MongoDB database
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/book_api';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB database');

    // Clear the existing collections (users and books) 
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('Successfully cleared old existing users and books');

    // Create atleast 5 fake users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const password = await bcrypt.hash('ayin101', 10);
      const user = new User({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: password
      });
      users.push(await user.save());
    }
    console.log('Successfully inserted 5 fake users');

    // Create aleast 10 fake books
    const books = [];
    for (let i = 0; i < 10; i++) {
      const book = new Book({
        title: faker.lorem.words(3),
        author: faker.person.fullName(),
        description: faker.lorem.sentences(2),
        userId: faker.helpers.arrayElement(users)._id 
      });
      books.push(await book.save());
    }
    console.log('Successfully inserted 10 fake books');

    console.log('Database seeding complete!!!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seedDatabase();
