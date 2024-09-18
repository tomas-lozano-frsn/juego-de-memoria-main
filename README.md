Estructura General del Código

El juego "Patrón de Memoria" tiene como objetivo que el jugador repita una secuencia de colores mostrada previamente. Cada vez que el jugador acierta, la secuencia aumenta en longitud y el juego se vuelve más desafiante. Si el jugador comete un error, el juego termina, y el jugador puede reiniciarlo.

Componentes y Estado en React

React se basa en el manejo de componentes y estado para actualizar la interfaz de usuario cuando cambian los datos. En este caso, el estado controla aspectos como la secuencia de colores, el progreso del jugador y la puntuación actual.

Descripción de los Estados del Juego

1.	sequence: Esta es la secuencia de colores que el juego genera de manera aleatoria. Cada vez que el jugador acierta, se añade un nuevo color a la secuencia.
2.	userSequence: Esta es la secuencia de colores que el jugador selecciona. Se compara con la secuencia generada por el juego para determinar si el jugador ha cometido un error.
3.	score: La puntuación del jugador, que aumenta cada vez que acierta la secuencia.
4.	isGameOver: Un booleano que indica si el juego ha terminado. Cuando es true, el jugador puede reiniciar el juego.
5.	isPlayingSequence: Este estado controla si el juego está mostrando la secuencia. Mientras la secuencia se muestra, el jugador no puede interactuar con los botones de colores.
6.	isGameStarted: Un estado que indica si el juego ha comenzado. Al iniciar, el estado es false, pero cambia a true cuando el jugador empieza el juego.
