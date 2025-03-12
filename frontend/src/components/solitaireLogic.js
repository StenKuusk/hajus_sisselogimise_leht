const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value, faceUp: false });
    }
  }
  return deck;
};

const createWinnableDeck = () => {
  const deck = createDeck();
  // Implement logic to create a winnable deck
  // This is a simplified example and may need adjustments for a fully winnable game
  deck.sort((a, b) => values.indexOf(a.value) - values.indexOf(b.value));
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
  const deck = shuffleDeck(createWinnableDeck());
  const tableau = Array.from({ length: 7 }, (_, index) => {
    const column = deck.splice(0, index + 1);
    column.forEach((card, cardIndex) => {
      card.faceUp = cardIndex === column.length - 1; // Only the last card is face-up
    });
    return column;
  });

  const stock = deck;
  const foundations = Array.from({ length: 4 }, () => []);

  return { tableau, stock, foundations };
};

const renderCard = (card) => {
  if (!card.faceUp) {
    return <img src="/images/cards/card_back.png" alt="Card back" className="card" />;
  }
  const cardImage = `/images/cards/${card.value}${card.suit}.png`;
  return <img src={cardImage} alt={`${card.value} of ${card.suit}`} className="card" />;
};

const renderFoundationTopCard = (foundation) => {
  if (foundation.length === 0) {
    return <div className="empty-foundation"></div>;
  }
  const topCard = foundation[foundation.length - 1];
  return renderCard(topCard);
};

const canMoveCard = (sourceCard, targetCard) => {
  const sourceValueIndex = values.indexOf(sourceCard.value);
  const targetValueIndex = values.indexOf(targetCard.value);
  const isOppositeColor = (sourceCard.suit === "hearts" || sourceCard.suit === "diamonds") !== (targetCard.suit === "hearts" || targetCard.suit === "diamonds");
  return isOppositeColor && sourceValueIndex === targetValueIndex - 1;
};

const canMoveToFoundation = (card, foundation) => {
  if (foundation.length === 0) {
    return card.value === "A";
  }
  const topCard = foundation[foundation.length - 1];
  const cardValueIndex = values.indexOf(card.value);
  const topCardValueIndex = values.indexOf(topCard.value);
  return card.suit === topCard.suit && cardValueIndex === topCardValueIndex + 1;
};

let gameStateHistory = [];

const saveGameState = (gameState) => {
  gameStateHistory.push(JSON.parse(JSON.stringify(gameState)));
};

const undoLastMove = () => {
  if (gameStateHistory.length > 1) {
    gameStateHistory.pop();
    return gameStateHistory[gameStateHistory.length - 1];
  }
  return gameStateHistory[0];
};

const handleCardDrop = (card, sourceIndex, targetIndex, gameState, targetType) => {
  saveGameState(gameState);
  const newGameState = { ...gameState };
  const sourceColumn = newGameState.tableau[sourceIndex];
  const cardIndex = sourceColumn.indexOf(card);
  const movingCards = sourceColumn.splice(cardIndex);

  if (targetType === 'tableau') {
    const targetColumn = newGameState.tableau[targetIndex];
    targetColumn.push(...movingCards);
  } else if (targetType === 'foundation') {
    const targetFoundation = newGameState.foundations[targetIndex];
    targetFoundation.push(card);
  }

  return newGameState;
};

const moveAllToFoundations = (gameState) => {
  const newGameState = { ...gameState };
  let moved;
  do {
    moved = false;
    for (let i = 0; i < newGameState.tableau.length; i++) {
      const column = newGameState.tableau[i];
      if (column.length > 0) {
        const card = column[column.length - 1];
        for (let j = 0; j < newGameState.foundations.length; j++) {
          if (canMoveToFoundation(card, newGameState.foundations[j])) {
            newGameState.foundations[j].push(column.pop());
            moved = true;
            break;
          }
        }
      }
    }
  } while (moved);
  return newGameState;
};

const checkAllCardsFlipped = (gameState) => {
  return gameState.tableau.every(column => column.every(card => card.faceUp));
};

const handleCardClick = (card, tableauIndex, gameState) => {
  saveGameState(gameState);
  const newGameState = { ...gameState };
  const column = newGameState.tableau[tableauIndex];

  if (!card.faceUp && column[column.length - 1] === card) {
    card.faceUp = true;
    if (checkAllCardsFlipped(newGameState)) {
      return moveAllToFoundations(newGameState);
    }
    return newGameState;
  }

  if (card.faceUp) {
    const cardIndex = column.indexOf(card);
    const movingCards = column.splice(cardIndex);

    for (let i = 0; i < newGameState.tableau.length; i++) {
      if (i !== tableauIndex) {
        const targetColumn = newGameState.tableau[i];
        const targetCard = targetColumn[targetColumn.length - 1];

        if (targetColumn.length === 0 || (targetCard && canMoveCard(movingCards[0], targetCard))) {
          newGameState.tableau[i] = targetColumn.concat(movingCards);
          if (checkAllCardsFlipped(newGameState)) {
            return moveAllToFoundations(newGameState);
          }
          return newGameState;
        }
      }
    }

    for (let i = 0; i < newGameState.foundations.length; i++) {
      if (canMoveToFoundation(movingCards[0], newGameState.foundations[i])) {
        newGameState.foundations[i].push(movingCards[0]);
        if (checkAllCardsFlipped(newGameState)) {
          return moveAllToFoundations(newGameState);
        }
        return newGameState;
      }
    }

    newGameState.tableau[tableauIndex] = column.concat(movingCards);
  }

  return newGameState;
};

const checkWinCondition = (foundations) => {
  return foundations.every((foundation) => foundation.length === 13);
};

export { initializeGame, renderCard, handleCardClick, handleCardDrop, checkWinCondition, undoLastMove, renderFoundationTopCard };