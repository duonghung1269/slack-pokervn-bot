const rx = require('rx');
const _ = require('underscore-plus');

const Slack = require('slack-client');
const MessageHelpers = require('../helper/message-helpers');
const PlayerInteraction = require('../pokervn/player-interation');

class PokerVnBot {

  constructor(token) {
    this.slack = new Slack(token, true, true);

  }

  // Brings this bot online and starts handling messages sent to it.
  login() {
    rx.Observable.fromEvent(this.slack, 'open')
      .subscribe(() => this.onClientOpened());

    this.slack.login();
    this.respondToMessages();
  }

  /**
  * Private: Listens for messages directed at this bot that contain the word
  * 'deal,' and poll players in response.
  *
  * Returns a {Disposable} that will end this subscription
  **/
  respondToMessages() {
    let messages = rx.Observable.fromEvent(this.slack, 'message')
                     .where(e => e.type === 'message');

    let atMentions = messages.where(e => MessageHelpers.isUserMentioned(this.slack.self.id, e.text));

    let disposalble = new rx.CompositeDisposable();
    disposalble.add(this.handleDealGameMessages(messages, atMentions));
    //disposalble.add(this.handleConfigMessages(atMentions));

    return disposalble;
  }
  /**
  * Private: Looks for messages directed at the bot that contain the word
  * "deal." When found, start polling players for a game.
  *
  * messages - An {Observable} representing messages posted to a channel
  * atMentions - An {Observable} representing messages directed at the bot
  *
  * Returns a {Disposable} that will end this subscription
  **/
  handleDealGameMessages(messages, atMentions) {
    return atMentions
            .where(e => e.text && e.text.toLowerCase().match(/\bdeal\b/))
            .map(e => this.slack.getChannelGroupOrDMByID(e.channel))
            .where(channel => {
              if (this.isPolling) {
                return false;
              } else if (this.isGameRunning) {
                channel.send('Another game is in progress, please quit that one first');
                return false;
              }

              return true;
            })
            .flatMap(channel => this.pollPlayersForGame(messages, channel))
            .subscribe();
  }

  /**
  * Private: Looks for messages directed at the bot that contain the word
  * "config" and have valid parameters. When found, set the parameter.
  *
  * atMentions - An {Observable} representing messages directed at the bot
  *
  * Returns a {Disposable} that will end this subscription
  **/
  handleConfigMessages(atMentions) {
    return atMentions
      .where(e => e.text && e.text.toLowerCase().includes('config'))
      .subscribe(e => {
        let channel = this.slack.getChannelGroupOrDMByID(e.channel);

        e.text.replace(/(\w*)=(\d*)/g, (match, key, value) => {
          if (this.gameConfigParams.indexOf(key) > -1 && value) {
            this.gameConfig[key] = value;
            channel.send(`Game ${key} has been set to ${value}.`);
          }
        });
      });
  }

  /*
  * Private: Polls players to join the game, and if we have enough, starts an
  * instance.
  *
  * messages - An {Observable} representing messages posted to the channel
  * channel - The channel where the deal message was posted
  *
  * Returns an {Observable} that signals completion of the game
  */
  pollPlayersForGame(messages, channel) {
    this.isPolling = true;

    return PlayerInteraction.pollPotentialPlayers(messages, channel)
                            .reduce((players, id) => {
                              let user = this.slack.getUserByID(id);
                              channel.send(`Great! ${user.name} has joined the game!!`);

                              players.push({id: user.id, name: user.name});
                              return players;
                            }, [])
                            .flatMap(players => {
                              this.isPolling = false;
                              this.addBotPlayers(players);

                              let messagesInChannel = messages.where(e => e.channel === channel.id);
                              return this.startGame(messagesInChannel, channel, players);
                            });
  }
}
