const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('✅ WhatsApp GPT Auto-Reply bot is live!');
});

app.post('/incoming', async (req, res) => {
  console.log('📩 Incoming from Twilio:', req.body);

  const incomingText = req.body.Body || '...';
  const twiml = new MessagingResponse();

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: incomingText }],
    });

    const reply = completion.choices[0].message.content;
    twiml.message(reply);

  } catch (error) {
    console.error('❌ GPT error:', error.message);
    twiml.message("Sorry, I'm having trouble replying right now.");
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

app.get('/incoming', (req, res) => {
  res.send('👋 This endpoint only supports POST requests from WhatsApp.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
