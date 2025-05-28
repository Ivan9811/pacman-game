document.addEventListener('DOMContentLoaded', () => {
    // ========== ELEMENTOS DEL DOM ==========
    const grid = document.querySelector('.grid');
    const cells = Array.from(grid.querySelectorAll('div'));
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const restartButton = document.getElementById('restart-button');

    // ========== CONFIGURACIÓN DE IMÁGENES ==========
    // Rutas de las imágenes - REEMPLAZA ESTAS RUTAS CON LAS TUYAS
    const pacmanRightImg = 'img/Pacman.svg.png';
    const pacmanLeftImg = 'img/left-pacman.png';
    const pacmanUpImg = 'img/up-pacman.png';
    const pacmanDownImg = 'img/down-pacman.png';
    const ghostRedImg = 'img/ghost-red.png';
    const ghostPinkImg = 'img/pinky.png';
    const ghostScaredImg = 'img/fantasmaAzul.png';

    // ========== VARIABLES DEL JUEGO ==========
    const width = 10; // Ancho del tablero
    let pacmanIndex = 11; // Posición inicial de Pac-Man
    let score = 0; // Puntuación actual
    let lives = 3; // Vidas del jugador
    let dotsEaten = 0; // Puntos comidos
    let ghosts = []; // Array de fantasmas
    let pacmanDirection = 'right'; // Dirección actual de Pac-Man
    let scaredTimer = null; // Timer para fantasmas asustados
    
    // Mapa de posiciones originales de los puntos para reiniciar el juego
    const dotPositions = [];
    const powerPillPositions = [13, 16, 73, 76]; // Posiciones fijas para power pills
    
    // Identificar posiciones de puntos normales (excluyendo power pills)
    cells.forEach((cell, index) => {
        if (cell.classList.contains('dot') && !powerPillPositions.includes(index)) {
            dotPositions.push(index);
        }
    });

    // ========== CLASE FANTASMA ==========
    /**
     * Clase que representa un fantasma en el juego
     */
    class Ghost {
        /**
         * Constructor del fantasma
         * @param {string} name - Nombre del fantasma
         * @param {number} startIndex - Posición inicial en el tablero
         * @param {string} className - Clase CSS para el color
         * @param {string} ghostImg - Ruta de la imagen del fantasma
         * @param {number} speed - Velocidad de movimiento en milisegundos
         */
        constructor(name, startIndex, className, ghostImg, speed = 500) {
            this.name = name;
            this.startIndex = startIndex;
            this.currentIndex = startIndex;
            this.className = className;
            this.ghostImg = ghostImg;
            this.speed = speed;
            this.timerId = null;
            this.directions = [-1, 1, -width, width]; // Izquierda, derecha, arriba, abajo
            this.isScared = false;
        }

        /**
         * Dibuja el fantasma en el tablero
         */
        draw() {
            const cell = cells[this.currentIndex];
            cell.classList.add('ghost', this.className);
            this.updateImage();
        }

        /**
         * Actualiza la imagen del fantasma según su estado
         */
        updateImage() {
            const cell = cells[this.currentIndex];
            if (this.isScared) {
                cell.style.backgroundImage = `url('${ghostScaredImg}')`;
            } else {
                cell.style.backgroundImage = `url('${this.ghostImg}')`;
            }
            cell.style.backgroundSize = 'contain';
            cell.style.backgroundRepeat = 'no-repeat';
            cell.style.backgroundPosition = 'center';
        }

        /**
         * Borra el fantasma del tablero
         */
        erase() {
            const cell = cells[this.currentIndex];
            cell.classList.remove('ghost', this.className);
            cell.style.backgroundImage = '';
            cell.style.backgroundSize = '';
            cell.style.backgroundRepeat = '';
            cell.style.backgroundPosition = '';
        }

        /**
         * Inicia el movimiento automático del fantasma
         */
        move() {
            const moveGhost = () => {
                const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
                const nextIndex = this.currentIndex + direction;

                // Verificar si el siguiente índice es válido
                if (
                    nextIndex >= 0 &&
                    nextIndex < cells.length &&
                    !cells[nextIndex].classList.contains('wall') &&
                    !cells[nextIndex].classList.contains('ghost')
                ) {
                    this.erase();
                    this.currentIndex = nextIndex;
                    this.draw();

                    // VERIFICAR COLISIÓN DESPUÉS DE QUE EL FANTASMA SE MUEVA
                    if (this.currentIndex === pacmanIndex) {
                        console.log(`${this.name} se movió a la posición de Pac-Man!`); // Debug
                        if (this.isScared) {
                            // Pac-Man come al fantasma asustado
                            console.log(`Pac-Man comió a ${this.name}!`); // Debug
                            this.erase();
                            this.currentIndex = this.startIndex;
                            this.isScared = false;
                            updateScore(200);
                            this.draw();
                            // Redibujar Pac-Man en su posición
                            cells[pacmanIndex].classList.add('pacman');
                            setPacmanImage();
                        } else {
                            // Fantasma come a Pac-Man
                            console.log(`${this.name} atrapó a Pac-Man!`); // Debug
                            loseLife();
                        }
                    }
                } else {
                    // Si no puede moverse, intenta otra dirección
                    moveGhost();
                }
            };

            this.timerId = setInterval(moveGhost, this.speed);
        }

        /**
         * Establece si el fantasma está asustado o no
         * @param {boolean} scared - True si el fantasma debe estar asustado
         */
        setScare(scared) {
            console.log(`${this.name} scared: ${scared}`); // Debug
            this.isScared = scared;
            this.updateImage(); // Actualizar la imagen inmediatamente
        }

        /**
         * Detiene el movimiento del fantasma
         */
        stop() {
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = null;
            }
        }
    }

    // ========== FUNCIONES DE UTILIDAD ==========
    
    /**
     * Obtiene la imagen de Pac-Man según su dirección actual
     * @returns {string} URL de la imagen de Pac-Man
     */
    function getPacmanImage() {
        switch (pacmanDirection) {
            case 'right':
                return `url('${pacmanRightImg}')`;
            case 'left':
                return `url('${pacmanLeftImg}')`;
            case 'up':
                return `url('${pacmanUpImg}')`;
            case 'down':
                return `url('${pacmanDownImg}')`;
            default:
                return `url('${pacmanRightImg}')`;
        }
    }

    /**
     * Establece la imagen de Pac-Man en su posición actual
     */
    function setPacmanImage() {
        const cell = cells[pacmanIndex];
        cell.style.backgroundImage = getPacmanImage();
        cell.style.backgroundSize = 'contain';
        cell.style.backgroundRepeat = 'no-repeat';
        cell.style.backgroundPosition = 'center';
    }

    /**
     * Actualiza la puntuación del jugador
     * @param {number} points - Puntos a añadir
     */
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
    }

    /**
     * Actualiza las vidas del jugador
     * @param {number} newLives - Nuevo número de vidas
     */
    function updateLives(newLives) {
        lives = newLives;
        livesDisplay.textContent = lives;
    }

    /**
     * Verifica si hay colisión entre Pac-Man y algún fantasma cuando Pac-Man se mueve
     */
    function checkGhostCollisionOnPacmanMove() {
        const collidedGhost = ghosts.find(ghost => ghost.currentIndex === pacmanIndex);
        if (collidedGhost) {
            if (collidedGhost.isScared) {
                // Pac-Man come al fantasma asustado
                console.log(`Pac-Man se movió hacia ${collidedGhost.name} asustado!`); // Debug
                collidedGhost.erase();
                collidedGhost.currentIndex = collidedGhost.startIndex;
                collidedGhost.isScared = false;
                updateScore(200);
                collidedGhost.draw();
            } else {
                // Fantasma come a Pac-Man
                console.log(`Pac-Man se movió hacia ${collidedGhost.name}!`); // Debug
                loseLife();
            }
        }
    }

    // ========== FUNCIONES DE JUEGO ==========

    /**
     * Maneja el movimiento de Pac-Man
     * @param {KeyboardEvent} e - Evento del teclado
     */
    function movePacman(e) {
        // Eliminar Pac-Man de la posición actual
        const currentCell = cells[pacmanIndex];
        currentCell.classList.remove('pacman');
        currentCell.style.backgroundImage = '';
        currentCell.style.backgroundSize = '';
        currentCell.style.backgroundRepeat = '';
        currentCell.style.backgroundPosition = '';

        let direction = 0;

        // Determinar la dirección basada en la tecla presionada
        switch (e.key) {
            case 'ArrowRight':
                direction = 1;
                pacmanDirection = 'right';
                break;
            case 'ArrowLeft':
                direction = -1;
                pacmanDirection = 'left';
                break;
            case 'ArrowUp':
                direction = -width;
                pacmanDirection = 'up';
                break;
            case 'ArrowDown':
                direction = width;
                pacmanDirection = 'down';
                break;
            default:
                // Si no es una tecla de dirección, mantener posición actual
                currentCell.classList.add('pacman');
                setPacmanImage();
                return;
        }

        // Calcular la nueva posición
        const nextIndex = pacmanIndex + direction;

        // Verificar si la nueva posición es válida (no es una pared)
        if (!cells[nextIndex].classList.contains('wall')) {
            pacmanIndex = nextIndex;
        } else {
            // Si es una pared, mantener posición actual
            currentCell.classList.add('pacman');
            setPacmanImage();
            return;
        }

        // Añadir Pac-Man a la nueva posición
        const newCell = cells[pacmanIndex];
        newCell.classList.add('pacman');
        setPacmanImage();

        // Verificar si Pac-Man come un punto normal
        if (newCell.classList.contains('dot')) {
            newCell.classList.remove('dot');
            updateScore(10);
            dotsEaten++;
        }

        // Verificar si Pac-Man come una power pill
        if (newCell.classList.contains('power-pill')) {
            console.log('Power pill comida!'); // Debug
            newCell.classList.remove('power-pill');
            updateScore(50);
            dotsEaten++;

            // Hacer que los fantasmas sean vulnerables
            scareGhosts();
        }

        // Verificar colisión con fantasmas DESPUÉS del movimiento de Pac-Man
        checkGhostCollisionOnPacmanMove();
    }

    /**
     * Hace que todos los fantasmas se vuelvan vulnerables (asustados)
     */
    function scareGhosts() {
        console.log('Asustando fantasmas...'); // Debug
        
        // Limpiar timer anterior si existe
        if (scaredTimer) {
            clearTimeout(scaredTimer);
        }

        // Hacer que todos los fantasmas sean vulnerables
        ghosts.forEach(ghost => {
            ghost.setScare(true);
        });

        // Después de 10 segundos, los fantasmas vuelven a la normalidad
        scaredTimer = setTimeout(() => {
            console.log('Fantasmas vuelven a la normalidad'); // Debug
            ghosts.forEach(ghost => {
                ghost.setScare(false);
            });
        }, 10000);
    }

    /**
     * Maneja la pérdida de una vida
     */
    function loseLife() {
        console.log('Perdiste una vida!'); // Debug
        updateLives(lives - 1);

        if (lives <= 0) {
            // Game Over - reiniciar completamente
            console.log('Game Over!'); // Debug
            resetGame();
        } else {
            // Reiniciar posición de Pac-Man
            const currentCell = cells[pacmanIndex];
            currentCell.classList.remove('pacman');
            currentCell.style.backgroundImage = '';
            currentCell.style.backgroundSize = '';
            currentCell.style.backgroundRepeat = '';
            currentCell.style.backgroundPosition = '';
            
            pacmanIndex = 11;
            pacmanDirection = 'right';
            
            const newCell = cells[pacmanIndex];
            newCell.classList.add('pacman');
            setPacmanImage();

            // Reiniciar posición de fantasmas
            ghosts.forEach(ghost => {
                ghost.erase();
                ghost.currentIndex = ghost.startIndex;
                ghost.isScared = false;
                ghost.draw();
            });

            // Limpiar timer de scared ghosts
            if (scaredTimer) {
                clearTimeout(scaredTimer);
                scaredTimer = null;
            }
        }
    }

    /**
     * Reinicia completamente el juego
     */
    function resetGame() {
        console.log('Reiniciando juego...'); // Debug
        
        // Detener todos los fantasmas
        ghosts.forEach(ghost => ghost.stop());

        // Limpiar timers
        if (scaredTimer) {
            clearTimeout(scaredTimer);
            scaredTimer = null;
        }

        // Limpiar el tablero
        cells.forEach(cell => {
            cell.classList.remove('pacman', 'ghost', 'red', 'pink', 'power-pill');
            cell.style.backgroundImage = '';
            cell.style.backgroundSize = '';
            cell.style.backgroundRepeat = '';
            cell.style.backgroundPosition = '';
        });

        // Restaurar todos los puntos normales
        dotPositions.forEach(index => {
            if (!cells[index].classList.contains('dot')) {
                cells[index].classList.add('dot');
            }
        });

        // Restaurar power pills
        powerPillPositions.forEach(index => {
            if (cells[index] && !cells[index].classList.contains('wall')) {
                cells[index].classList.remove('dot');
                cells[index].classList.add('power-pill');
            }
        });

        // Reiniciar variables del juego
        pacmanIndex = 11;
        score = 0;
        lives = 3;
        dotsEaten = 0;
        scoreDisplay.textContent = '0';
        livesDisplay.textContent = '3';
        pacmanDirection = 'right';

        // Inicializar el juego
        initGame();
    }

    /**
     * Inicializa el juego
     */
    function initGame() {
        // Añadir Pac-Man al tablero
        cells[pacmanIndex].classList.add('pacman');
        setPacmanImage();

        // Crear fantasmas
        ghosts = [];
        const blinky = new Ghost('blinky', 35, 'red', ghostRedImg, 300);
        const pinky = new Ghost('pinky', 36, 'pink', ghostPinkImg, 400);
        ghosts = [blinky, pinky];

        // Dibujar y mover fantasmas
        ghosts.forEach(ghost => {
            ghost.draw();
            ghost.move();
        });

        // Añadir power pills en posiciones específicas
        powerPillPositions.forEach(index => {
            if (cells[index] && !cells[index].classList.contains('wall')) {
                cells[index].classList.remove('dot');
                cells[index].classList.add('power-pill');
            }
        });

        console.log('Juego inicializado con', ghosts.length, 'fantasmas'); // Debug
    }

    // ========== EVENT LISTENERS ==========
    
    // Movimiento de Pac-Man con teclado
    document.addEventListener('keydown', movePacman);
    
    // Botón de reiniciar
    restartButton.addEventListener('click', resetGame);

    // ========== INICIALIZACIÓN ==========
    
    // Iniciar el juego automáticamente cuando se carga la página
    initGame();
});
