const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value, faceUp: false });
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const initializeGame = () => {
  const deck = shuffleDeck(createDeck());
  const tableau = Array.from({ length: 7 }, (_, index) => {
    const column = deck.splice(0, index + 1);
    column[column.length - 1].faceUp = true;
    return column;
  });

  const stock = deck;
  const foundations = Array.from({ length: 4 }, () => []);

  return { tableau, stock, foundations };
};

const handleCardClick = (card, tableauIndex, gameState) => {
  const newGameState = { ...gameState };
  return newGameState;
};

const checkWinCondition = (foundations) => {
  return foundations.every((foundation) => foundation.length === 13);
};

export { initializeGame, handleCardClick, checkWinCondition };