const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ WhatsApp GPT Auto-Reply is running.");
});

app.post("/incoming", async (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMsg = req.body.Body || "";
  const userNumber = req.body.From;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const gptReply = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: incomingMsg }],
    });

    const replyText = gptReply.data.choices[0].message.content;
    twiml.message(replyText);
  } catch (error) {
    console.error("AI error:", error.message);
    twiml.message("Sorry, I'm having trouble replying right now.");
  }

  res.type("text/xml").send(twiml.toString());
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
