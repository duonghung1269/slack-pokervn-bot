require('babel/register');

const PokerVnBot = require('../src/bot/pokervnbot');
const token = process.env.BOT_API_KEY || 'xoxb-12912207895-FAi3hNozask0b0rbRxcYKB0f';
const name = process.env.BOT_NAME || 'test-bot';

const bot = new PokerVnBot(token, true, true);
bot.run();
