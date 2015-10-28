const _ = require('underscore-plus');

class PlayerOrder {

  static determine(players, dealerButton, round) {
    return players;
  }

  /*
  * Public: Returns the index of the next player to act.
  *
  * index - The current index
  * players - An array of all players in the hand, sorted by position
  *
  * Returns the index of the next player in the hand
  */
  static getNextPlayerIndex(index, players) {
    let player = null;
    do {
      index = (index + 1) % players.length;
      player = players[index];
    } while (!player.isInHand || !player.isInRound);

    return index;
  }
}

module.exports = PlayerOrder;
