const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const amqp = require('amqplib/callback_api');

const app = express();
const port = 8080;

// Middleware to parse JSON
app.use(express.json());

// Proxy setup for Inventory API
const inventoryApiUrl = 'http://192.168.56.101:8080';
app.use(
  '/api/movies',
  createProxyMiddleware({
    target: inventoryApiUrl,
    changeOrigin: true,
  })
);

// RabbitMQ setup
const rabbitMqUrl = 'amqp://localhost';
let channel;

// Connect to RabbitMQ
amqp.connect(rabbitMqUrl, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  // Create a channel
  connection.createChannel((error1, ch) => {
    if (error1) {
      throw error1;
    }
    channel = ch;
    const queue = 'billing_queue';

    // Ensure the queue exists
    channel.assertQueue(queue, {
      durable: true,
    });
  });
});

// Route for Billing API
app.post('/api/billing', (req, res) => {
  const queue = 'billing_queue';
  const msg = JSON.stringify(req.body);

  channel.sendToQueue(queue, Buffer.from(msg), {
    persistent: true,
  });

  console.log(` [x] Sent ${msg}`);
  res.status(200).send('Message sent to billing queue');
});

// Start the server
app.listen(port, () => {
  console.log(`Gateway running at http://localhost:${port}`);
});
