'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var isFirstRun = false;

var TestBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'test-bot';
    
    this.user = null;
    this.db = null;
}

util.inherits(TestBot, Bot);

TestBot.prototype.run = function() {
    TestBot.super_.call(this, this.settings);
    
    this.on('start', this._onStart);
    //this.on('message', this._onMessage);
}

TestBot.prototype._onStart = function() {
    this._loadBotUser();        
    this._firstRunCheck();
}

TestBot.prototype._loadBotUser = function() {
    var self = this;
    console.log('bot name', self.name);
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
}

TestBot.prototype._firstRunCheck = function() {
    if (!isFirstRun) {
        this._welcomeMessage();
        isFirstRun = true;
    }
}

TestBot.prototype._welcomeMessage = function() {
    console.log('channel name: ', this.channels[3]);
    this.postMessageToChannel(this.channels[3].name, 'Hi guys, anyone there?', {as_user: true});
}



module.exports = TestBot;