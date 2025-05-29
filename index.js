const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Home route
app.get("/", (req, res) => {
  res.send("✅ WhatsApp Auto-Reply Bot is live!");
});

// Incoming webhook
app.post("/incoming", async (req, res) => {
  const incomingMsg = req.body.Body || "...";
  const sender = req.body.From;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const chat = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: incomingMsg }],
    });

    const reply = chat.data.choices[0].message.content;
    console.log(`Reply to ${sender}: ${reply}`);
  } catch (error) {
    console.error("OpenAI error:", error.message);
  }

  res.send("OK");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
