const Card = require('./card.js');

class Deck {

  constructor() {
    this.cards = [];
    for (let suit of Card.suits()) {
      for (let rank of Card.ranks()) {
        let card = new Card(rank, suit);
        this.cards.push(card);
      }
    }
  }

  // Fisher-Yates shuffle.
  shuffle() {
    let temp, idx;
    let cardsRemaining = this.cards.length;

    // While there remain elements to shuffle…
    while (cardsRemaining) {

      // Pick a remaining element…
      idx = Math.floor(Math.random() * cardsRemaining--);

      // And swap it with the current element.
      temp = this.cards[cardsRemaining];
      this.cards[cardsRemaining] = this.cards[idx];
      this.cards[idx] = temp;
    }
  }

  drawCard() {
    return this.cards.shift();
  }

  toString() {
    return this.cards.join();
  }

  toAsciiString() {
    return this.cards.map(card => card.toAsciiString()).join();
  }
}

module.exports = Deck;
