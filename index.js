const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('✅ WhatsApp GPT Auto-Reply is running!');
});

// Webhook endpoint for Twilio
app.post('/webhook', (req, res) => {
  console.log('📩 Incoming message from Twilio:', req.body);
  res.status(200).send('Webhook received!');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
