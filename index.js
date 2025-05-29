const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Health check
app.get('/', (req, res) => {
  res.send('✅ Rizwan GPT Auto-Reply is live!');
});

// WhatsApp Webhook
app.post('/incoming', async (req, res) => {
  const incomingMsg = req.body.Body || '';
  const from = req.body.From || '';

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: incomingMsg }],
    });

    const reply = response.data.choices[0].message.content;

    console.log(`📩 From: ${from} | 💬 User: ${incomingMsg}`);
    console.log(`🤖 GPT: ${reply}`);
  } catch (error) {
    console.error('❌ OpenAI error:', error.message);
  }

  res.send('Webhook received');
});

// Fallback for GET
app.get('/incoming', (req, res) => {
  res.send('Only POST requests are accepted.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
