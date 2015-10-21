var Card = function Constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
}

Card.prototype.ranks = function() {
  return ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
}

Card.prototype.suits = function() {
  return ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
}

Card.prototype.suitMapping = function() {
  return {'Spades':'♠', 'Hearts':'♥', 'Diamonds':'♦', 'Clubs':'♣'};
}

Card.prototype.toAsciiString = function() {
  return this.rank + this.suit.substring(0, 1).toLowerCase();
}

Card.prototype.toString = function() {
  return this.rank + Card.suitMapping()[this.suit];
}

module.exports = Card;
