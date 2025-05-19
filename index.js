const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
const port = process.env.PORT || 3000;

// Parse Twilio's POST request
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/', (req, res) => {
  res.send('✅ WhatsApp GPT Auto-Reply bot is live!');
});

// ✅ Twilio webhook (POST only)
app.post('/incoming', (req, res) => {
  console.log('📩 Incoming from Twilio:', req.body);

  const msg = req.body.Body || 'Empty';
  const twiml = new MessagingResponse();
  twiml.message(`You said: ${msg}`);

  res.type('text/xml');
  res.send(twiml.toString());
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
