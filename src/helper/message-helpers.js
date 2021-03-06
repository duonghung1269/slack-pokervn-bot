class MessageHelpers {

  static isUserMentioned(userId, messageText) {
    let userTag = this.getUserMentionedString(userId);
    return messageText && (messageText.indexOf(userTag) > -1);
  }

  static getUserMentionedString(userId) {
    return `<@${userId}>`;
  }

  static containsWord(messageText, word) {
      return messageText && messageText.toLowerCase().match(new RegExp(`\\b${word}\\b`));
  }

}

module.exports = MessageHelpers;
