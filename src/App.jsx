import React, { useState, useEffect, useCallback } from 'react';
import useSound from 'use-sound';
import './App.css';

const colors = ['red', 'green', 'blue', 'yellow'];

function App() {
  const [gameSequence, setGameSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [message, setMessage] = useState('Press Start to Play');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);

  // Sonidos para cada color con use-sound
  const [playRed] = useSound('/sounds/red.mp3');
  const [playGreen] = useSound('/sounds/green.mp3');
  const [playBlue] = useSound('/sounds/blue.mp3');
  const [playYellow] = useSound('/sounds/yellow.mp3');

  // Muestra la secuencia del juego
  const showSequence = useCallback((sequence) => {
    sequence.forEach((color, index) => {
      setTimeout(() => {
        setMessage(`Watch: ${color}`);
        flashColor(color);
        // Reproduce el sonido correspondiente al color
        if (color === 'red') playRed();
        if (color === 'green') playGreen();
        if (color === 'blue') playBlue();
        if (color === 'yellow') playYellow();
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setMessage('Your turn!');
            setIsPlayerTurn(true);
          }, 500);
        }
      }, (index + 1) * 1000);
    });
  }, [playRed, playGreen, playBlue, playYellow]);

  const nextRound = useCallback(() => {
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    setGameSequence((prevSequence) => [...prevSequence, nextColor]);
    setPlayerSequence([]);
    setIsPlayerTurn(false);
    showSequence([...gameSequence, nextColor]);
  }, [gameSequence, showSequence]);

  const flashColor = (color) => {
    const button = document.getElementById(color);
    button.classList.add('flash');

    setTimeout(() => {
      button.classList.remove('flash');
    }, 500);
  };

  const handlePlayerInput = (color) => {
    if (!isPlayerTurn || gameOver) return;
    setPlayerSequence([...playerSequence, color]);
    flashColor(color);
    
    // Reproduce el sonido correspondiente al color seleccionado por el jugador
    if (color === 'red') playRed();
    if (color === 'green') playGreen();
    if (color === 'blue') playBlue();
    if (color === 'yellow') playYellow();
  };

  useEffect(() => {
    if (playerSequence.length === gameSequence.length && playerSequence.length > 0) {
      if (playerSequence.join('') === gameSequence.join('')) {
        setMessage('Correct! Watch the next sequence.');
        setScore((prevScore) => prevScore + 1);
        setTimeout(nextRound, 1000);
      } else {
        setMessage('Wrong! Game Over.');
        setGameOver(true);
        setGameInProgress(false);
        // Reiniciar el juego después de un retraso para que el jugador vea el mensaje de Game Over
        setTimeout(resetGame, 2000); // Ajusta el tiempo si es necesario
      }
    }
  }, [playerSequence, gameSequence, nextRound]);

  const resetGame = () => {
    setGameSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setIsPlayerTurn(false);
    setMessage('Press Start to Play');
    setGameOver(false);
    setGameInProgress(false);
  };

  const startGame = () => {
    if (gameInProgress) return;
    if (gameOver) resetGame();
    setGameInProgress(true);
    nextRound();
  };

  return (
    <div className="App">
      <h1>Memory Pattern Game</h1>
      <p>{message}</p>
      <div className="score">Score: {score}</div>
      <div className="button-grid">
        {colors.map((color) => (
          <button
            key={color}
            id={color}
            className={`color-button ${color}`}
            onClick={() => handlePlayerInput(color)}
            disabled={!isPlayerTurn}
          ></button>
        ))}
      </div>
      <button onClick={startGame} disabled={gameInProgress}>
        Start Game
      </button>
      <button onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

export default App;
