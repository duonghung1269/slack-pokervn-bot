'use strict';

var TestBot = require('../lib/testbot');
var token = process.env.BOT_API_KEY || 'xoxb-12912207895-FAi3hNozask0b0rbRxcYKB0f';
var name = process.env.BOT_NAME || 'test-bot';

var bot = new TestBot({
    token: token,
    name: name
});

bot.run();