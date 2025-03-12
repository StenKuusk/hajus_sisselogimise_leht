import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Solitaire.css';
import { initializeGame, handleCardClick, handleCardDrop, checkWinCondition, renderCard, undoLastMove, renderFoundationTopCard } from './solitaireLogic';

const Solitaire = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(initializeGame());
  const [draggedCard, setDraggedCard] = useState(null);
  const [sourceIndex, setSourceIndex] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const onCardClick = (card, tableauIndex) => {
    const newGameState = handleCardClick(card, tableauIndex, gameState);
    setGameState(newGameState);
    if (checkWinCondition(newGameState.foundations)) {
      alert('Congratulations! You won the game!');
    }
  };

  const onCardDragStart = (card, tableauIndex) => {
    setDraggedCard(card);
    setSourceIndex(tableauIndex);
  };

  const onCardDrop = (targetIndex, targetType) => {
    if (draggedCard !== null && sourceIndex !== null) {
      const newGameState = handleCardDrop(draggedCard, sourceIndex, targetIndex, gameState, targetType);
      setGameState(newGameState);
      setDraggedCard(null);
      setSourceIndex(null);
      if (checkWinCondition(newGameState.foundations)) {
        alert('Congratulations! You won the game!');
      }
    }
  };

  const onUndoClick = () => {
    const previousGameState = undoLastMove();
    setGameState(previousGameState);
  };

  const renderTableau = () => {
    return gameState.tableau.map((column, index) => (
      <div key={index} className={`tableau-column ${column.length === 0 ? 'highlight' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={() => onCardDrop(index, 'tableau')}>
        {column.map((card, cardIndex) => (
          <div key={cardIndex} onClick={() => onCardClick(card, index)} draggable onDragStart={() => onCardDragStart(card, index)}>
            {renderCard(card)}
          </div>
        ))}
      </div>
    ));
  };

  const renderFoundations = () => {
    return gameState.foundations.map((foundation, index) => (
      <div key={index} className="foundation" onDragOver={(e) => e.preventDefault()} onDrop={() => onCardDrop(index, 'foundation')}>
        {renderFoundationTopCard(foundation)}
      </div>
    ));
  };

  return (
    <div className='solitaire'>
      <button className='back-button' onClick={() => navigate('/homepage')}>Back to Homepage</button>
      <h1>Solitaire Game</h1>
      <button className='undo-button' onClick={onUndoClick}>Undo</button>
      <div className="foundations">{renderFoundations()}</div>
      <div className="tableau">{renderTableau()}</div>
    </div>
  );
};

export default Solitaire;