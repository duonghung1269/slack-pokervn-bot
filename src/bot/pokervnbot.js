'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var isFirstRun = false;

var PokerVnBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'test-bot';

    this.user = null;
    this.db = null;
}

util.inherits(PokerVnBot, Bot);

PokerVnBot.prototype.run = function() {
    PokerVnBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    //this.on('message', this._onMessage);
}

PokerVnBot.prototype._onStart = function() {
    this._loadBotUser();
    this._firstRunCheck();
}

PokerVnBot.prototype._loadBotUser = function() {
    var self = this;
    console.log('bot name', self.name);
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
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
