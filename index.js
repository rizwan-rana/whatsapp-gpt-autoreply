const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/', (req, res) => {
  res.send('✅ WhatsApp GPT Auto-Reply bot is live!');
});

// Twilio webhook (POST from WhatsApp)
app.post('/incoming', async (req, res) => {
  console.log('📩 Incoming from Twilio:', req.body);

  const incomingText = req.body.Body || '...';
  const twiml = new MessagingResponse();

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const chatReply = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: incomingText }]
    });

    const replyText = chatReply.choices[0].message.content;
    twiml.message(replyText);

  } catch (error) {
    console.error('❌ GPT error:', error.message);
    twiml.message("Sorry, I'm having trouble replying right now.");
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Optional GET view for browser visit
app.get('/incoming', (req, res) => {
  res.send('👋 This endpoint only works with POST requests from WhatsApp.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
