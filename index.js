const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// Auth directory (session will be saved here)
const { state, saveState } = useSingleFileAuthState("./auth_info/session.json");

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveState);

  // Show QR in terminal
  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrcode.generate(qr, { small: true });
    }
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log("Connection closed:", reason);
    }
    if (connection === "open") {
      console.log("✅ WhatsApp Connected");
    }
  });

  // Respond to messages
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const textMsg = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!textMsg) return;

    const reply = await getGPTReply(textMsg);

    await sock.sendMessage(msg.key.remoteJid, { text: reply });
    console.log(`Replied to ${msg.key.remoteJid}: ${reply}`);
  });
}

// Get GPT reply from OpenAI
async function getGPTReply(message) {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ GPT API Error:", err.message);
    return "Sorry, I'm having trouble replying right now.";
  }
}

startBot();
