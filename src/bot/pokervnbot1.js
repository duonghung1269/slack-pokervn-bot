const util = require('util');
const path = require('path');
const fs = require('fs');
const Bot = require('slack-client');
const MessageHelpers = require('../helper/message-helpers');

var isFirstRun = false;

var PokerVnBot = function Constructor(token, autoReconnect, autoMark) {
    this.token = token;
    this.autoReconnect = autoReconnect;
    this.autoMark = autoMark;

    this.botUser = null;
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
    var self = this;

    // if (message.type === 'message' && self._isDirectMessage(self.botUser.id, message.text)) {
    if (message.type === 'message' && MessageHelpers.isUserMentioned(self.botUser.id, message.text)) {
        console.log(channel.name + ':' + user.name + ':' + message.text);
        var trimmedMessage = message.text.trim(); //.substr(this._makeMention(self.self.id).length).trim();

        var onlineUsers = self._getOnlineHumansForChannel(channel)
             .filter(function(u) { return u.id != user.id; })
             .map(function(u) { return MessageHelpers.getUserMentionedString(u.id); });

        channel.send(onlineUsers.join(', ') + '\r\n' + user.real_name + 'said: ' + trimmedMessage);
    }
}

PokerVnBot.prototype._onStart = function() {
    console.log('_onStart');
    this._loadBotUser();
    this._firstRunCheck();
}

PokerVnBot.prototype._loadBotUser = function() {
    var self = this;
    this.botUser = Object.keys(self.users)
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

PokerVnBot.prototype._getOnlineHumansForChannel = function(channel) {
  if (!channel) {
    return [];
  }

  var self = this;

  return (channel.members || [])
        .map(function (id) { self.users[id]; })
        .filter(function(u) { !!u && u.is_bot && u.presence == 'active'; });
}

module.exports = PokerVnBot;
