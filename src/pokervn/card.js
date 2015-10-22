class Card {

  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  static ranks() {
    return ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  }

  static suits() {
    return ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
  }

  static suitMapping() {
    return {'Spades':'♠', 'Hearts':'♥', 'Diamonds':'♦', 'Clubs':'♣'};
  }

  toString() {
    return `${this.rank}${Card.suitMapping()[this.suit]}`;
  }

  toAsciiString() {
    return `${this.rank}${this.suit.substring(0, 1).toLowerCase()}`;
  }
}

module.exports = Card;
