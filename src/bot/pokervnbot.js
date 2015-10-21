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

    this.user = null;
    this.db = null;
}

util.inherits(PokerVnBot, Bot);

PokerVnBot.prototype.run = function() {
    PokerVnBot.super_.call(this, this.token, this.autoReconnect, this.autoMark);
    this.login();
    this.on('open', this._onOpen);
    this.on('message', this._onMessage);
}

PokerVnBot.prototype._onOpen = function() {
    var self = this;
    var channels = Object.keys(self.channels)
        .map(function (k) { return self.channels[k]; })
        .filter(function (c) { return c.is_member; })
        .map(function (c) { return c.name; });
 
    var groups = Object.keys(self.groups)
        .map(function (k) { return self.groups[k]; })
        .filter(function (g) { return g.is_open && !g.is_archived; })
        .map(function (g) { return g.name; });
 
    //console.log('bot: ', self.self);
    console.log('Welcome to Slack. You are ' + self.self.name + ' of ' + self.team.name);
 
    if (channels.length > 0) {
        console.log('You are in: ' + channels.join(', '));
    }
    else {
        console.log('You are not in any channels.');
    }
 
    if (groups.length > 0) {
       console.log('As well as: ' + groups.join(', '));
    }
    self._loadBotUser();
}

PokerVnBot.prototype._onMessage = function(message) {
    var channel = this.getChannelGroupOrDMByID(message.channel);
    var user = this.getUserByID(message.user);

    if (message.type === 'message' && this._isDirectMessage(this.user.id, message.text)) {
        console.log(channel.name + ':' + user.name + ':' + message.text);
    }
}

PokerVnBot.prototype._onStart = function() {
    console.log('_onStart');
    this._loadBotUser();
    this._firstRunCheck();
}

PokerVnBot.prototype._loadBotUser = function() {
    var self = this;
    this.user = Object.keys(self.users)
        .map(function (k) { return self.users[k]; })
        .filter(function (u) { return u.name === self.self.name; })[0];
}

PokerVnBot.prototype._firstRunCheck = function() {
    if (!isFirstRun) {
        this._welcomeMessage();
        isFirstRun = true;
    }
}

PokerVnBot.prototype._welcomeMessage = function() {
    console.log('channel name: ', this.channels);
    this.postMessageToChannel(this.channels[3].name, 'Hi guys, anyone there?', {as_user: true});
}

PokerVnBot.prototype._makeMention = function(userId) {
    return '<@' + userId + '>';
}

PokerVnBot.prototype._isDirectMessage = function(userId, messageText) {
    var userTag = this._makeMention(userId);
    return messageText &&
           messageText.length >= userTag.length &&
           messageText.substr(0, userTag.length) === userTag;
}


module.exports = PokerVnBot;
