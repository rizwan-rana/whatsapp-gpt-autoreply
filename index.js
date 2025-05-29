const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Health check route
app.get('/', (req, res) => {
  res.send('Rizwan Auto GPT AI is live!');
});

// Incoming webhook
app.post('/incoming', async (req, res) => {
  const incomingMsg = req.body.Body || '';
  const to = req.body.To || '';
  const from = req.body.From || '';

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

    const reply = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: incomingMsg }]
    });

    const message = reply.data.choices[0].message.content;
    console.log(`Message from ${from} to ${to}: ${incomingMsg}`);
    console.log(`Reply: ${message}`);
  } catch (error) {
    console.error('Error:', error.message);
  }

  res.send('OK');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
