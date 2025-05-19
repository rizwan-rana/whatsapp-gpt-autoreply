const express = require("express");
const app = express();
const MessagingResponse = require("twilio").twiml.MessagingResponse;

app.use(express.urlencoded({ extended: false }));

app.post("/incoming", (req, res) => {
  const incomingMsg = req.body.Body || "No message";
  const twiml = new MessagingResponse();
  twiml.message(`You said: ${incomingMsg}`);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Bot is live");
});
