const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
const port = process.env.PORT || 3000;

// Parse URL-encoded POST data from Twilio
app.use(express.urlencoded({ extended: false }));

// ✅ Health check for Railway or browser
app.get('/', (req, res) => {
  res.send('✅ WhatsApp GPT Auto-Reply bot is live!');
});

// ✅ Twilio webhook POST handler
app.post('/incoming', (req, res) => {
  console.log('📩 Incoming from Twilio:', req.body);

  const msg = req.body.Body || 'Empty';
  const twiml = new MessagingResponse();
  twiml.message(`You said: ${msg}`);

  res.type('text/xml');
  res.send(twiml.toString());
});

// ✅ Friendly message for browser visit to /incoming
app.get('/incoming', (req, res) => {
  res.send('👋 This endpoint only works with POST requests from WhatsApp.');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
