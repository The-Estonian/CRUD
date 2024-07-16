require('dotenv').config({ path: '/home/env/.env' });
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 8080;

// Initialize Sequelize to use PostgreSQL
const sequelize = new Sequelize(
  process.env.INVENTORY_DATABASE_NAME,
  process.env.INVENTORY_DATABASE_USER,
  process.env.INVENTORY_DATABASE_PASSWORD,
  {
    host: process.env.INVENTORY_DATABASE_HOST,
    dialect: 'postgres',
  }
);

// Define a model
const Movies = sequelize.define('movies', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync all defined models to the DB
sequelize.sync().then(() => console.log('Database & tables created!'));

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.get('/api/movies/test', (req, res) => {
  res.send('Hello from inventory');
});

app.get('/api/movies', async (req, res) => {
  const movies = await Movies.findAll();
  console.log(movies);
  res.json(movies);
});

app.post('/api/movies', async (req, res) => {
  try {
    const { title, description } = req.body;
    const movie = await Movies.create({ title, description });
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: error });
  }
});

app.delete('/api/movies', async (req, res) => {
  try {
    const deletedCount = await Movies.destroy({
      where: {},
      truncate: true,
    });
    console.log(`Deleted ${deletedCount} movies`);
    res.status(200).json({ message: 'All movies have been deleted' });
  } catch (error) {
    console.error('Error deleting movies:', error);
    res.status(500).json({ error: 'An error occurred while deleting movies' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://192.168.56.103:${port}`);
});
