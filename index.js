const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.send('✅ WhatsApp GPT Auto-Reply bot is running!');
});

app.post('/incoming', async (req, res) => {
  const body = req.body;

  // Ensure OpenAI key exists
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    console.error('❌ OPENAI_API_KEY is not set.');
    return res.status(500).send('Server configuration error.');
  }

  const configuration = new Configuration({
    apiKey: openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  const messageBody = body.Body || '';
  const fromNumber = body.From || 'Unknown sender';

  try {
    console.log(`📩 Incoming message from ${fromNumber}:`, messageBody);

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are Rizwan Rana responding via WhatsApp. Always reply in Roman Urdu or English, matching tone of sender.',
        },
        {
          role: 'user',
          content: messageBody,
        },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    console.log(`🤖 Reply: ${reply}`);

    res.set('Content-Type', 'text/plain');
    res.send(reply);
  } catch (error) {
    console.error('❌ OpenAI error:', error.message || error);
    res.status(500).send('Sorry, I am having trouble replying right now.');
  }
});

// Fallback for GET requests to /incoming
app.get('/incoming', (req, res) => {
  res.send('👋 This endpoint only works with POST requests from WhatsApp.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
