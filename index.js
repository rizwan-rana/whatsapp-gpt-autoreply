const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './auth_info' }),
  puppeteer: {
    args: ['--no-sandbox'],
  },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp is ready!');
});

client.on('message', (message) => {
  if (message.body === 'Hi') {
    message.reply('Hello! Bot is working.');
  }
});

client.initialize();
