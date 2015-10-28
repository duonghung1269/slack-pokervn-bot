const rx = require('rx');
const _ = require('underscore-plus');

const Deck = require('./deck');
const SlackApiRx = require('./slack-api-rx');
const PlayerInteraction = require('./player-interaction');
const PotManager = require('./pot-manager');

class BlackJackVn {

  /*
  * Public: Creates a new BlackJackVn game instance.
  *
  * slack - An instance of the Slack client
  * messages - An {Observable} representing messages posted to the channel
  * channel - The channel where the game will be played
  * players - The players participating in the game
  * scheduler - (Optional) The scheduler to use for timing events
  */
  constructor(slack, messages, channel, players, scheduler=rx.Scheduler.timeout) {
    this.slack = slack;
    this.messages = messages;
    this.channel = channel;
    this.players = players;
    this.scheduler = scheduler;

    this.smallBlind = 1;
    this.bigBlind = this.smallBlind * 2;
    this.potManager = new PotManager(this.channel, players, this.smallBlind);
    this.gameEnded = new rx.Subject();

    // Each player starts with 100 big blinds
    for (let player of this.players) {
      player.chips = this.bigBlind * 100;
    }
  }

  /*
  * Public: Starts a new game.
  *
  * playerDms - A hash mapping player ID to their DM channel, used to inform
  *             players of their pocket cards.
  * dealerButton - (Optional) The initial index of the dealer button, or null
  *                to have it randomly assigned
  * timeBetweenHands - (Optional) The time, in milliseconds, to pause between
  *                    the end of one hand and the start of another
  *
  * Returns an {Observable} that signals completion of the game
  */
  start(playerDms, dealerButton=null, timeBetweenHands=5000) {
    this.isRunning = true;
    this.playerDms = playerDms;
    //this.dealerButton = dealerButton === null ? Math.floor(Math.random() * this.players.length) : dealerButton;
    // hard code deal from first player
    this.dealerButton = 0;

    rx.Observable.return(true)
      .flatMap(() => this.playHand()
                         .flatMap(() => rx.Observable.timer(timeBetweenHands, this.scheduler)))
      .repeat()
      .takeUtil(this.gameEnded)
      .subscribe();

      return this.gameEnded;
  }
  /*
  * Private: Plays a single hand of hold'em. The sequence goes like this:
  * 1. Clear the board and player hands
  * 2. Shuffle the deck and give players their cards
  * 3. Do a pre-flop betting round
  * 4. Deal the flop and do a betting round
  * 5. Deal the turn and do a betting round
  * 6. Deal the river and do a final betting round
  * 7. Decide a winner and send chips their way
  *
  * Returns an {Observable} signaling the completion of the hand
  */
  playHand() {
    this.board = [];
    this.playerHands = {};

    this.initializeHand();
    this.deck = new Deck();
    this.deck.shuffle();
    this.dealPlayerCards();

    let handEnded = new rx.Subject();

    this.doBettingRound('preflop').subscribe(result => {
      if (result.isHandComplete) {
        this.potManager.endHand(result);
        this.onHandEnded(handEnded);
      } else {
        this.flop(handEnded);
      }
    });
  }

  initializeHand() {
    for (let player of this.players) {
      player.isInRound = player.isInHand = player.chips > 0;
      player.isAllIn = false;
      player.isBettor = false;
    }

    let participants = _.filter(this.players, player => player.isInHand);
    this.potManager.createPot(participants);

  }

  /*
  * Private: Deals hole cards to each player in the game. To communicate this
  * to the players, we send them a DM with the text description of the cards.
  * We can't post in channel for obvious reasons.
  *
  * Returns nothing
  */
  dealPlayerCards() {
    this.orderedPlayers = PlayerOrder.determine(this.getPlayersInHand(), this.dealerButton, 'deal');

    // first card deal
    for (let player of this.orderedPlayers) {
      let card = this.deck.drawCard();
      this.playerHands[player.id] = [card];
    }

    // second card deal
    for (let player of this.orderedPlayers) {
      let card = this.deck.drawCard();
      this.playerHands[player.id].push(card);
      player.holeCards = this.playerHands[player.id];
    }


  }

  getPlayersInHand() {
    return _.filter(this.players, player => player.isInHand);
  }

  /*
  * Public: Ends the current game immediately.
  *
  * Returns nothing
  */
  quit(winner) {
    if (winner) {
      this.channel.send(`Cmm ${winner.name}, you've won! :fcuk:`);
    }

    this.gameEnded.onNext(winner);
    this.gameEnded.onCompleted();

    this.isRunning = false;
  }
}
