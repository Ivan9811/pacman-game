INTEGRANTES:
Ivan Dario Ramirez Casallas
Nicol Camila Madero
Andres Fabian Viveros

DESCRIPCION DEL JUEGO
Este es un proyecto de Pac-Man recreado con HTML, CSS y JavaScript, 
en el que el jugador controla a Pac-Man para recolectar puntos, 
evitar a los fantasmas y usar píldoras de poder para volverse invencible por unos segundos. 
El juego está optimizado para pantallas pequeñas, cuenta con reinicio, contador de vidas y animaciones visuales atractivas.

FRASES IMPLEMENTADAS(ESTRUCTURA, PERSONALIZACION, JUGABILIDAD)

ESTRUCTURA
El juego está diseñado sobre una grilla de 10x10.
Las celdas representan paredes, puntos, píldoras de poder, Pac-Man y fantasmas.
Cada elemento tiene una clase CSS asociada (.wall, .dot, .power-pill, .pacman, .ghost).

PERSONALIZACION
Colores personalizados con variables CSS (:root) para facilitar ajustes.
Animaciones CSS para destacar las píldoras de poder (@keyframes pulse).
Sistema de interfaz con:
Panel de puntuación.
Contador de vidas.
Botón de reinicio con hover interactivo.
Imágenes y prioridades visuales (z-index) bien gestionadas para que los personajes se muestren correctamente.

JUGABILIDAD
Pac-Man se mueve con las flechas del teclado.
Al recolectar puntos y píldoras, estos desaparecen.
Si Pac-Man toca un fantasma sin estar invencible, pierde una vida.
Si toma una píldora de poder, los fantasmas se vuelven vulnerables temporalmente.

ASPECTOS DESTACADOS
Diseño responsivo con media queries para que el juego se vea bien en celulares y tablets.
Prioridad visual (z-index) para que las imágenes de Pac-Man y los fantasmas dominen sobre los elementos de fondo.
Interfaz clara y amigable con botón interactivo de reinicio.
Código organizado y modular para facilitar mantenimiento y nuevas mejoras.



