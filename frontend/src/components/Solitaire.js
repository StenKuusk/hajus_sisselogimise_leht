import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Solitaire.css';
import { initializeGame, handleCardClick, checkWinCondition, renderCard } from './solitaireLogic';


const Solitaire = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(initializeGame());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const onCardClick = (card, tableauIndex) => {
    const newGameState = handleCardClick(card, tableauIndex, gameState);
    setGameState(newGameState);
  };

  const renderTableau = () => {
    return gameState.tableau.map((column, index) => (
      <div key={index} className="tableau-column">
        {column.map((card, cardIndex) => (
          <div key={cardIndex} onClick={() => onCardClick(card, index)}>
            {renderCard(card)}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className='solitaire'>
      <button className='back-button' onClick={() => navigate('/homepage')}>Back to Homepage</button>
      <h1>Solitaire Game</h1>
      <div className="tableau">{renderTableau()}</div>
    </div>
  );
};

export default Solitaire;