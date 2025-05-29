const express = require("express");
const { MessagingResponse } = require("twilio").twiml;
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("✅ WhatsApp GPT Auto-Reply is live!");
});

app.post("/incoming", async (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMsg = req.body.Body || "";
  const toSend = incomingMsg.trim().toLowerCase();

  try {
    const openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );

    const gptRes = await openai.createChatCompletion({
      model: "gpt-4", // fallback to gpt-3.5-turbo if needed
      messages: [{ role: "user", content: toSend }],
    });

    const reply = gptRes.data.choices[0].message.content;
    twiml.message(reply);
  } catch (err) {
    console.error("❌ GPT error:", err.message || err);
    twiml.message("Sorry, I'm having trouble replying right now.");
  }

  res.type("text/xml").send(twiml.toString());
});

app.post("*", (req, res) => {
  res.status(405).send("👋 This endpoint only accepts POST requests to /incoming.");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
