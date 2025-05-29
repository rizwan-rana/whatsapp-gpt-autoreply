const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Default route
app.get('/', (req, res) => {
  res.send('✅ WhatsApp GPT Auto-Reply Bot is live!');
});

// Webhook to receive WhatsApp messages
app.post('/incoming', async (req, res) => {
  try {
    const incomingMsg = req.body.Body || '';
    const sender = req.body.From || '';

    console.log(`📩 Incoming from ${sender}:`, incomingMsg);

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY is missing!');
      return res.status(500).send('API key not configured.');
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: incomingMsg },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    console.log(`🤖 Replying to ${sender}:`, reply);

    res.send(`<Response><Message>${reply}</Message></Response>`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.send(`<Response><Message>Sorry, I'm having trouble replying right now.</Message></Response>`);
  }
});

// Fallback GET
app.get('/incoming', (req, res) => {
  res.send('👋 This endpoint only works with POST requests from WhatsApp.');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
