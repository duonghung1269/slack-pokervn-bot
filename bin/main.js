require('babel/register');
const http = require('http');

try {
    const fs = require('fs');
    const pathToken = process.env.SLACK_POKERVN_BOT_TOKEN;
    const token = pathToken || fs.readFileSync('token.txt', 'utf-8').trim();
} catch(error) {
    console.log('You need to put your API token in a token.txt file');
    return;
}

const PokerVnBot = require('../src/bot/pokervnbot');
const pokerVnBot = new PokerVnBot(token);
pokerVnBot.login();

http.createServer(function(req, res) {
    res.end('SLACK_POKERVN_BOT_TOKEN');
}).listen(process.env.PORT || 5000);
