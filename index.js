const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Auto-Reply is active.');
});

// Incoming WhatsApp messages
app.post('/incoming', async (req, res) => {
  const incomingMsg = req.body.Body?.trim() || '';
  const sender = req.body.From || 'Unknown';
  const twiml = new MessagingResponse();

  console.log(`📩 Message from ${sender}: "${incomingMsg}"`);

  if (!incomingMsg) {
    console.warn('⚠️ Empty message received');
    return res.send(twiml.toString());
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Rizwan. Always reply in Roman Urdu. Be natural, friendly, and polite unless the message is business/formal.',
        },
        {
          role: 'user',
          content: incomingMsg,
        },
      ],
    });

    const reply = response.choices?.[0]?.message?.content || "Theek hoon yaar, tum sunao?";
    console.log(`🤖 Reply: ${reply}`);
    twiml.message(reply);
  } catch (err) {
    console.error('❌ OpenAI error:', err.message);
    twiml.message("Yaar abhi masla lag raha hai. Thodi der baad try karo.");
  }

  res.send(twiml.toString());
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).send("❌ Invalid endpoint. Use POST /incoming only.");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is live on port ${port}`);
});
