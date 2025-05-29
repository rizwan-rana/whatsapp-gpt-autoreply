const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.send('✅ Connected to WhatsApp GPT Auto-Reply. Bot is live!');
});

// WhatsApp Webhook
app.post('/incoming', async (req, res) => {
  console.log('📩 Incoming message from Twilio');
  const incomingMsg = req.body.Body || '';
  const twiml = new MessagingResponse();

  if (!incomingMsg) {
    console.log('❌ Empty message received');
    return res.send(twiml.toString());
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Reply in Roman Urdu as Rizwan. Keep tone natural and casual unless told otherwise.' },
        { role: 'user', content: incomingMsg },
      ],
    });

    const reply = completion.choices[0].message.content;
    twiml.message(reply);
  } catch (error) {
    console.error('❗ GPT Error:', error.message);
    twiml.message("Yaar, thodi der tak reply nahi de sakta. Thoda masla aagaya hai.");
  }

  res.send(twiml.toString());
});

// Invalid route
app.use((req, res) => {
  res.status(404).send("❌ Invalid endpoint. Use POST /incoming only.");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
