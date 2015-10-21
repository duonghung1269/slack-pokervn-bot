var Card = require('./card');

var Deck = function Constructor() {
  this.cards = [];
  for (var suit in Card.suits()) {
    for (var rank in Card.ranks()) {
      this.cards.push(new Card(rank, suit));
    }
  }
}

// using Fisher-Yates shuffle
Deck.prototype.shuffle = function(numberOfShuffles) {
  var tmp, index;
  var remainCards = this.cards.length;
  while (numberOfShuffles > 0) {
    while(remainCards) {
      // pick a remaining card index
      index = Math.floor(Math.random() * remainCards--);

      tmp = this.cards[remainCards];
      this.cards[remainCards] = this.cards[index];
      this.cards[index] = tmp;
    }

    numberOfShuffles--;
  }
}

Deck.prototype.drawCard = function() {
  return this.cards.shift();
}

Deck.prototype.toString = function() {
  return this.cards.join();
}

Deck.prototype.toAsciiString = function() {
  return this.cards.map(card => card.toAsciiString()).join();
}

module.exports = Deck;
