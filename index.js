const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.post('/incoming', async (req, res) => {
  const message = req.body.Body;
  const from = req.body.From;

  if (!message || !from) {
    return res.status(400).send('Invalid request');
  }

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const aiReply = openaiResponse.data.choices[0].message.content;

    // Send response back to Twilio
    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Message>${aiReply}</Message>
      </Response>
    `);
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Message>Maazrat, AI reply mein error aa gaya.</Message>
      </Response>
    `);
  }
});

app.get('/', (req, res) => {
  res.send('WhatsApp GPT Auto-Reply is running.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
