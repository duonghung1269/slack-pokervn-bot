const _ = require('underscore-plus');

class PotManager {

  /*
  * Public: Creates a new instance of {PotManager}, which is used to manage
  * pots and store outcomes for the duration of a game.
  *
  * channel - The channel where the game is taking place
  * players - The players participating in the game
  * minimumBet - The minimum bet in the game
  */
  constructor(channel, players, minimumBet) {
    this.channel = channel;
    this.players = players;
    this.minimumBet = minimumBet;

    this.pots = [];
    this.outcomes = [];
  }

  /*
  * Public: Creates a new pot and assigns it as the current destination for
  * bets. This can occur at the start of a hand or at the end of a betting
  * round, when making side pots.
  *
  * participants - The players participating in the pot
  * amount - (Optional) The starting amount in the pot, defaults to 0
  *
  * Returns nothing
  */
  createPot(participants, amount=0) {
    if (this.currentPot && this.currentPot.amount === 0) {
      let index = this.pots.indexOf(this.currentPot);
      this.pots.splice(index, 1);
    }

    this.currentPot = {
      participants: participants;
      amount: amount
    }
  }
}

module.exports = PotManager;
