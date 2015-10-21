'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slack-client');
var isFirstRun = false;

var PokerVnBot = function Constructor(token, autoReconnect, autoMark) {
    this.token = token;
    this.autoReconnect = autoReconnect;
    this.autoMark = autoMark;
    //this.settings.name = this.settings.name || 'test-bot';

    this.user = null;
    this.db = null;
}

util.inherits(PokerVnBot, Bot);

// PokerVnBot.on('message', function(message) {
//     var channel = slack.getChannelGroupOrDMByID(message.channel);
//     var user = slack.getUserByID(message.user);
//
//     if (message.type === 'message') {
//         console.log(channel.name + ':' + user.name + ':' + message.text);
//     }
// });

PokerVnBot.prototype.run = function() {
    PokerVnBot.super_.call(this, this.token, this.autoReconnect, this.autoMark);
    this.login();
    this.on('open', this._onStart);
    //this.on('message', this._onMessage);
    //this.on('message', this._onMessage);
}

PokerVnBot.prototype._onMessage = function() {
  console.log('onMessage');
}

PokerVnBot.prototype._onStart = function() {
    console.log('_onStart');
    this._loadBotUser();
    this._firstRunCheck();
}

PokerVnBot.prototype._loadBotUser = function() {
    var self = this;
    console.log('bot name', self.name);
    console.log('this.users', self.users);
    // this.user = this.users.filter(function (user) {
    //     return user.name === self.name;
    // })[0];
}

PokerVnBot.prototype._firstRunCheck = function() {
    if (!isFirstRun) {
        this._welcomeMessage();
        isFirstRun = true;
    }
}

PokerVnBot.prototype._welcomeMessage = function() {
    console.log('channel name: ', this.channels[3]);
    this.postMessageToChannel(this.channels[3].name, 'Hi guys, anyone there?', {as_user: true});
}



module.exports = PokerVnBot;
