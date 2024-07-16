const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const amqp = require('amqplib/callback_api');
const axios = require('axios');

const app = express();
const port = 8080;

const inventoryApiUrl = 'http://192.168.56.103:8080/api/movies';
const billingApiUrl = 'http://192.168.56.102:8080/api/billing';

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
    consumeMessages(channel);
  });
});

function consumeMessages(channel) {
  console.log(
    `[*] Waiting for messages in billing_queue. To exit press CTRL+C`
  );

  channel.consume(
    'billing_queue',
    async (message) => {
      const msg = message.content.toString();
      console.log(`[x] Received ${msg}`);

      try {
        // Forward message to the billing API server
        const response = await axios.post(billingApiUrl, JSON.parse(msg), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(
          `[>] Forwarded ${msg} to ${billingApiUrl}. Response: ${response.status}`
        );
      } catch (error) {
        console.error(
          `Error forwarding message ${msg} to ${billingApiUrl}:`,
          error.message
        );
      }

      channel.ack(message);
    },
    { noAck: false }
  );
}

// Middleware to parse JSON
app.use(express.json());

app.get('/api/gateway', (req, res) => {
  res.send('Hello from gateway');
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
  console.log(`Gateway running at http://192.168.56.101:${port}`);
});
