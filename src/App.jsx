import React, { useState, useEffect, useCallback } from 'react';
import useSound from 'use-sound'; // Importamos la biblioteca para reproducir sonidos
import './App.css'; // Importamos los estilos CSS

// Definimos los colores que usaremos en el juego
const colors = ['rojo', 'verde', 'azul', 'amarillo'];

function App() {
  // Estados para el juego
  const [gameSequence, setGameSequence] = useState([]); // Almacena la secuencia generada por el juego
  const [playerSequence, setPlayerSequence] = useState([]); // Almacena la secuencia seleccionada por el jugador
  const [isPlayerTurn, setIsPlayerTurn] = useState(false); // Indica si es el turno del jugador
  const [message, setMessage] = useState('Presiona Iniciar para jugar'); // Mensaje en pantalla para guiar al jugador
  const [score, setScore] = useState(0); // Almacena la puntuación del jugador
  const [gameOver, setGameOver] = useState(false); // Indica si el juego ha terminado
  const [gameInProgress, setGameInProgress] = useState(false); // Indica si hay un juego en progreso
  const [showingSequence, setShowingSequence] = useState(false); // Indica si la secuencia del juego está siendo mostrada

  // Sonidos para cada color
  const [playRed] = useSound('/public/sounds/red.mp3');
  const [playGreen] = useSound('/public/sounds/green.mp3');
  const [playBlue] = useSound('/public/sounds/blue.mp3');
  const [playYellow] = useSound('/public/sounds/yellow.mp3');

  // Función para mostrar la secuencia generada por el juego
  const showSequence = useCallback((sequence) => {
    setShowingSequence(true); // Indicamos que se está mostrando la secuencia
    sequence.forEach((color, index) => {
      setTimeout(() => {
        setMessage(`${color}`); // Actualizamos el mensaje para mostrar qué color se está resaltando
        flashColor(color); // Resaltamos el color en pantalla

        // Reproducimos el sonido correspondiente al color
        if (color === 'rojo') playRed();
        if (color === 'verde') playGreen();
        if (color === 'azul') playBlue();
        if (color === 'amarillo') playYellow();

        // Cuando termine de mostrar toda la secuencia, pasamos el turno al jugador
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setMessage('Tu turno'); // Avisamos al jugador que es su turno
            setIsPlayerTurn(true); // Activamos el turno del jugador
            setShowingSequence(false); // Indicamos que ya no se está mostrando la secuencia
          }, 500);
        }
      }, (index + 1) * 1000); // Mostramos los colores con una separación de tiempo
    });
  }, [playRed, playGreen, playBlue, playYellow]);

  // Función para avanzar al siguiente nivel (añadir un color más a la secuencia)
  const nextRound = useCallback(() => {
    const nextColor = colors[Math.floor(Math.random() * colors.length)]; // Seleccionamos un color al azar
    setGameSequence((prevSequence) => [...prevSequence, nextColor]); // Añadimos el nuevo color a la secuencia
    setPlayerSequence([]); // Reiniciamos la secuencia del jugador
    setIsPlayerTurn(false); // El jugador aún no puede interactuar
    showSequence([...gameSequence, nextColor]); // Mostramos la nueva secuencia con el color añadido
  }, [gameSequence, showSequence]);

  // Función para resaltar un color en pantalla
  const flashColor = (color) => {
    const button = document.getElementById(color); // Obtenemos el botón correspondiente al color
    button.classList.add('flash'); // Añadimos la clase 'flash' para el efecto visual

    setTimeout(() => {
      button.classList.remove('flash'); // Quitamos el efecto visual después de un breve tiempo
    }, 500);
  };

  // Función que maneja el input del jugador cuando selecciona un color
  const handlePlayerInput = (color) => {
    if (!isPlayerTurn || gameOver) return; // Si no es el turno del jugador o el juego ha terminado, no hacemos nada
    setPlayerSequence([...playerSequence, color]); // Añadimos el color seleccionado a la secuencia del jugador
    flashColor(color); // Resaltamos el color seleccionado

    // Reproducimos el sonido correspondiente al color
    if (color === 'rojo') playRed();
    if (color === 'verde') playGreen();
    if (color === 'azul') playBlue();
    if (color === 'amarillo') playYellow();
  };

  // Efecto que se ejecuta cuando la secuencia del jugador cambia
  useEffect(() => {
    // Si la secuencia del jugador tiene la misma longitud que la del juego, verificamos si es correcta
    if (playerSequence.length === gameSequence.length && playerSequence.length > 0) {
      // Si ambas secuencias son iguales, el jugador acertó
      if (playerSequence.join('') === gameSequence.join('')) {
        setMessage('¡Correcto! Mira la siguiente secuencia.'); // Mostramos mensaje de éxito
        setScore((prevScore) => prevScore + 1); // Aumentamos la puntuación
        setTimeout(nextRound, 1000); // Avanzamos a la siguiente ronda
      } else {
        // Si las secuencias no coinciden, el jugador cometió un error
        setMessage('¡Error! Fin del juego.'); // Mostramos mensaje de error
        setGameOver(true); // Indicamos que el juego ha terminado
        setGameInProgress(false); // Detenemos el progreso del juego
        setTimeout(resetGame, 2000); // Reiniciamos el juego después de 2 segundos
      }
    }
  }, [playerSequence, gameSequence, nextRound]);

  // Función para reiniciar el juego
  const resetGame = () => {
    setGameSequence([]); // Reiniciamos la secuencia del juego
    setPlayerSequence([]); // Reiniciamos la secuencia del jugador
    setScore(0); // Reiniciamos la puntuación
    setIsPlayerTurn(false); // Desactivamos el turno del jugador
    setMessage('Presiona Iniciar para jugar'); // Mostramos el mensaje inicial
    setGameOver(false); // Indicamos que el juego no ha terminado
    setGameInProgress(false); // No hay juego en progreso
  };

  // Función para iniciar el juego
  const startGame = () => {
    if (gameInProgress || showingSequence) return; // Si ya hay un juego en progreso o se está mostrando la secuencia, no hacemos nada
    if (gameOver) resetGame(); // Si el juego ha terminado, lo reiniciamos
    setGameInProgress(true); // Indicamos que el juego está en progreso
    nextRound(); // Iniciamos la primera ronda
  };

  return (
    <div className="App">
      <h1>Juego de Patrón de Memoria</h1>
      <p>{message}</p>
      <div className="score">puntaje: {score}</div>
      
      {/* Grid de botones de colores */}
      <div className="button-grid">
        {colors.map((color) => (
          <button
            key={color}
            id={color}
            className={`color-button ${color}`} // Aplicamos la clase correspondiente al color
            onClick={() => handlePlayerInput(color)} // Función que maneja la selección del jugador
            disabled={!isPlayerTurn || showingSequence} // Deshabilitamos el botón si no es el turno del jugador o se está mostrando la secuencia
          ></button>
        ))}
      </div>
      
      {/* Botones para iniciar y reiniciar el juego */}
      <button onClick={startGame} disabled={gameInProgress || showingSequence}>
      Iniciar Juego
      </button>
      <button onClick={resetGame} disabled={showingSequence}> 
      Reiniciar Juego
      </button>
    </div>
  );
}

export default App;