require('dotenv').config({ path: '/home/env/.env' });
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 8080;

// Initialize Sequelize to use PostgreSQL
const sequelize = new Sequelize(
  process.env.BILLING_DATABASE_NAME,
  process.env.BILLING_DATABASE_USER,
  process.env.BILLING_DATABASE_PASSWORD,
  {
    host: process.env.BILLING_DATABASE_HOST,
    dialect: 'postgres',
  }
);

// Define a model
const MovieOrders = sequelize.define('orders', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number_of_items: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync all defined models to the DB
sequelize.sync().then(() => console.log('Database & tables created!'));

// Middleware to parse JSON
app.use(express.json());

app.get('/api/billing', async (req, res) => {
  const movies = await MovieOrders.findAll();
  console.log(movies);
  res.json(movies);
});

app.post('/api/billing', async (req, res) => {
  try {
    const { title, description } = req.body;
    const movie = await MovieOrders.create({ title, description });
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error creating billing:', error);
    res.status(500).json({ error: error });
  }
});

// Start the serverls
app.listen(port, () => {
  console.log(`Server is running on http://192.168.56.102:${port}`);
});
