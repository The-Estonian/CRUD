const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 8080;

// Initialize Sequelize to use PostgreSQL
const sequelize = new Sequelize('movies', 'inventory', 'inventory', {
  host: 'localhost',
  dialect: 'postgres',
});

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
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/movies', async (req, res) => {
  const movies = await Movies.findAll();
  console.log(movies);
  res.json(movies);
});

app.post('/movies', async (req, res) => {
  try {
    const { title, description } = req.body;
    const movie = await Movies.create({ title, description });
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: error });
  }
});

// Start the serverls
app.listen(port, () => {
  console.log(`Server is running on http://192.168.56.101:${port}`);
});
