/**
 * Funções adicionais para integração completa do modo de jogador
 */

// Funções para melhorar a experiência do jogador
function enhancePlayerExperience() {
    // Adiciona efeitos visuais para feedback do jogador
    addPlayerFeedbackEffects();
    
    // Adiciona sons para ações do jogador
    setupGameSounds();
    
    // Melhora a resposta dos controles
    improveControlResponsiveness();
    
    // Adiciona notificações de jogo
    setupGameNotifications();
    
    console.log('Experiência do jogador aprimorada com sucesso');
}

// Adiciona efeitos visuais para feedback do jogador
function addPlayerFeedbackEffects() {
    // Adiciona um efeito visual quando o jogador muda de direção
    const addDirectionChangeEffect = (gameNumber) => {
        const game = window[`game${gameNumber}`];
        if (!game) return;
        
        // Guarda a função original de mudança de direção
        const originalChangeDirection = game.changeDirection;
        
        // Substitui com uma nova função que adiciona efeito visual
        game.changeDirection = function(direction) {
            // Chama a função original primeiro
            originalChangeDirection.call(this, direction);
            
            // Adiciona efeito visual apenas se for controle do jogador
            if (this.controlMode === 'player') {
                const gameContainer = document.getElementById(`game${gameNumber}`);
                if (!gameContainer) return;
                
                // Cria o elemento de efeito
                const effect = document.createElement('div');
                effect.className = 'direction-change-effect';
                
                // Define a posição do efeito
                const head = this.snake.cells[0];
                const tileSize = this.tileSize;
                
                effect.style.top = `${head.y * tileSize}px`;
                effect.style.left = `${head.x * tileSize}px`;
                effect.style.width = `${tileSize}px`;
                effect.style.height = `${tileSize}px`;
                
                // Adiciona o efeito ao container
                gameContainer.appendChild(effect);
                
                // Remove o efeito após a animação
                setTimeout(() => {
                    effect.remove();
                }, 500);
            }
        };
    };
    
    // Adiciona o efeito para ambos os jogos
    addDirectionChangeEffect(1);
    addDirectionChangeEffect(2);
    
    // Adiciona estilos para os efeitos
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .direction-change-effect {
            position: absolute;
            pointer-events: none;
            background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            z-index: 5;
            animation: pulseEffect 0.5s ease-out;
        }
        
        @keyframes pulseEffect {
            0% { transform: scale(0.5); opacity: 0.8; }
            100% { transform: scale(2); opacity: 0; }
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Configura sons para ações do jogador
function setupGameSounds() {
    // Criar objeto de sons
    window.gameSounds = {
        eat: new Audio(),
        move: new Audio(),
        collision: new Audio(),
        levelUp: new Audio()
    };
    
    // Configurar URLs de som (opcional - os jogadores podem adicionar seus próprios arquivos de som)
    // window.gameSounds.eat.src = 'sounds/eat.mp3';
    // window.gameSounds.move.src = 'sounds/move.mp3';
    // window.gameSounds.collision.src = 'sounds/collision.mp3';
    // window.gameSounds.levelUp.src = 'sounds/levelup.mp3';
    
    // Adicionar sons ao jogo 1
    if (window.game1) {
        // Som ao comer comida
        const originalCheckFoodCollision1 = window.game1.checkFoodCollision;
        window.game1.checkFoodCollision = function() {
            const hadCollision = (this.snake.x === this.food.x && this.snake.y === this.food.y);
            originalCheckFoodCollision1.call(this);
            
            if (hadCollision && window.gameSounds && window.gameSounds.eat.src) {
                window.gameSounds.eat.currentTime = 0;
                window.gameSounds.eat.play().catch(e => console.log('Som desativado ou não suportado'));
            }
        };
        
        // Som ao colidir
        const originalGameOver1 = window.game1.gameOver;
        window.game1.gameOver = function() {
            originalGameOver1.call(this);
            
            if (window.gameSounds && window.gameSounds.collision.src) {
                window.gameSounds.collision.currentTime = 0;
                window.gameSounds.collision.play().catch(e => console.log('Som desativado ou não suportado'));
            }
        };
    }
    
    // Adicionar sons ao jogo 2 (similar ao jogo 1)
    if (window.game2) {
        // Som ao comer comida
        const originalCheckFoodCollision2 = window.game2.checkFoodCollision;
        window.game2.checkFoodCollision = function() {
            const hadCollision = (this.snake.x === this.food.x && this.snake.y === this.food.y);
            originalCheckFoodCollision2.call(this);
            
            if (hadCollision && window.gameSounds && window.gameSounds.eat.src) {
                window.gameSounds.eat.currentTime = 0;
                window.gameSounds.eat.play().catch(e => console.log('Som desativado ou não suportado'));
            }
        };
        
        // Som ao colidir
        const originalGameOver2 = window.game2.gameOver;
        window.game2.gameOver = function() {
            originalGameOver2.call(this);
            
            if (window.gameSounds && window.gameSounds.collision.src) {
                window.gameSounds.collision.currentTime = 0;
                window.gameSounds.collision.play().catch(e => console.log('Som desativado ou não suportado'));
            }
        };
    }
}

// Melhora a resposta dos controles
function improveControlResponsiveness() {
    // Implementa sistema de buffer de entrada para evitar perda de comandos rápidos
    class InputBuffer {
        constructor(size = 3) {
            this.buffer = [];
            this.maxSize = size;
        }
        
        addInput(input) {
            this.buffer.push(input);
            if (this.buffer.length > this.maxSize) {
                this.buffer.shift();
            }
        }
        
        getNextInput() {
            return this.buffer.shift();
        }
        
        hasInputs() {
            return this.buffer.length > 0;
        }
        
        clear() {
            this.buffer = [];
        }
    }
    
    // Cria buffers de entrada para cada jogo
    window.inputBuffers = {
        game1: new InputBuffer(),
        game2: new InputBuffer()
    };
    
    // Modifica o handler de teclas para usar o buffer
    document.addEventListener('keydown', (e) => {
        // Mapeia teclas para direções
        let direction = null;
        let gameNumber = null;
        
        // Processa teclas de seta (jogo 1)
        if (e.key === 'ArrowUp') {
            direction = 'up';
            gameNumber = 1;
        } else if (e.key === 'ArrowDown') {
            direction = 'down';
            gameNumber = 1;
        } else if (e.key === 'ArrowLeft') {
            direction = 'left';
            gameNumber = 1;
        } else if (e.key === 'ArrowRight') {
            direction = 'right';
            gameNumber = 1;
        }
        
        // Processa teclas WASD (jogo 2)
        else if (e.key.toLowerCase() === 'w') {
            direction = 'up';
            gameNumber = 2;
        } else if (e.key.toLowerCase() === 's') {
            direction = 'down';
            gameNumber = 2;
        } else if (e.key.toLowerCase() === 'a') {
            direction = 'left';
            gameNumber = 2;
        } else if (e.key.toLowerCase() === 'd') {
            direction = 'right';
            gameNumber = 2;
        }
        
        // Se tiver uma direção válida, adiciona ao buffer
        if (direction && gameNumber) {
            const game = window[`game${gameNumber}`];
            
            // Apenas adiciona ao buffer se o jogo existir e estiver no modo jogador
            if (game && game.controlMode === 'player') {
                window.inputBuffers[`game${gameNumber}`].addInput(direction);
                
                // Previne comportamento padrão para evitar rolagem da página
                e.preventDefault();
            }
        }
    });
    
    // Processa os buffers de entrada periodicamente
    setInterval(() => {
        // Processa buffer do jogo 1
        if (window.game1 && window.game1.controlMode === 'player' && window.game1.gameLoop) {
            const buffer = window.inputBuffers.game1;
            if (buffer.hasInputs()) {
                const direction = buffer.getNextInput();
                window.game1.changeDirection(direction);
            }
        }
        
        // Processa buffer do jogo 2
        if (window.game2 && window.game2.controlMode === 'player' && window.game2.gameLoop) {
            const buffer = window.inputBuffers.game2;
            if (buffer.hasInputs()) {
                const direction = buffer.getNextInput();
                window.game2.changeDirection(direction);
            }
        }
    }, 50); // Verifica a cada 50ms
}

// Configura sistema de notificações de jogo
function setupGameNotifications() {
    // Cria o container de notificações, se ainda não existir
    let notificationContainer = document.getElementById('gameNotifications');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'gameNotifications';
        notificationContainer.className = 'game-notifications';
        document.body.appendChild(notificationContainer);
        
        // Adiciona estilos para notificações
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .game-notifications {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                pointer-events: none;
            }
            
            .game-notification {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                font-size: 0.9em;
                opacity: 0;
                transform: translateY(20px);
                animation: notificationFadeIn 0.3s forwards, notificationFadeOut 0.3s 2.7s forwards;
            }
            
            @keyframes notificationFadeIn {
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes notificationFadeOut {
                to { opacity: 0; transform: translateY(-20px); }
            }
            
            .game-notification.info {
                border-left: 3px solid #2196F3;
            }
            
            .game-notification.success {
                border-left: 3px solid #4CAF50;
            }
            
            .game-notification.warning {
                border-left: 3px solid #FF9800;
            }
            
            .game-notification.error {
                border-left: 3px solid #F44336;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
    
    // Função para mostrar notificações
    window.showGameNotification = function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.textContent = message;
        
        notificationContainer.appendChild(notification);
        
        // Remove a notificação após a duração especificada
        setTimeout(() => {
            notification.remove();
        }, duration);
    };
    
    // Adiciona notificações para eventos importantes do jogo
    
    // Jogo 1: Nível aumentado
    if (window.game1) {
        // Guarda a função original
        const originalLevelUp1 = window.game1.levelUp;
        
        // Substitui com nova função que também mostra notificação
        window.game1.levelUp = function() {
            originalLevelUp1.call(this);
            
            // Mostra notificação
            if (window.showGameNotification) {
                window.showGameNotification(`Snake 1 alcançou o nível ${this.level}!`, 'success');
            }
        };
    }
    
    // Jogo 2: Nível aumentado
    if (window.game2) {
        // Guarda a função original
        const originalLevelUp2 = window.game2.levelUp;
        
        // Substitui com nova função que também mostra notificação
        window.game2.levelUp = function() {
            originalLevelUp2.call(this);
            
            // Mostra notificação
            if (window.showGameNotification) {
                window.showGameNotification(`Snake 2 alcançou o nível ${this.level}!`, 'success');
            }
        };
    }
}

// Adiciona opções de acessibilidade para jogadores com necessidades especiais
function setupAccessibilityOptions() {
    // Cria o container de opções de acessibilidade
    const accessibilityContainer = document.createElement('div');
    accessibilityContainer.className = 'accessibility-options';
    accessibilityContainer.innerHTML = `
        <div class="accessibility-header">
            <span>♿ Acessibilidade</span>
            <button class="minimize-btn" id="minimizeAccessibility">_</button>
        </div>
        <div class="accessibility-content">
            <div class="option-row">
                <label for="highContrastMode">Modo de Alto Contraste:</label>
                <input type="checkbox" id="highContrastMode">
            </div>
            <div class="option-row">
                <label for="largerElements">Elementos Maiores:</label>
                <input type="checkbox" id="largerElements">
            </div>
            <div class="option-row">
                <label for="reducedMotion">Reduzir Movimento:</label>
                <input type="checkbox" id="reducedMotion">
            </div>
            <div class="option-row">
                <label for="gameSpeed">Velocidade do Jogo:</label>
                <input type="range" id="gameSpeed" min="0.5" max="1.5" step="0.1" value="1">
            </div>
        </div>
    `;
    
    document.body.appendChild(accessibilityContainer);
    
    // Adiciona estilos
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .accessibility-options {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 250px;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: white;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
        }
        
        .accessibility-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px 10px 0 0;
            cursor: grab;
        }
        
        .accessibility-content {
            padding: 15px;
        }
        
        .option-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .accessibility-options.minimized .accessibility-content {
            display: none;
        }
        
        /* Estilos para alto contraste quando ativado */
        body.high-contrast .game-container canvas {
            filter: contrast(150%) brightness(120%);
        }
        
        /* Estilos para elementos maiores quando ativado */
        body.larger-elements .keys-indicator .key-up,
        body.larger-elements .keys-indicator .key-down,
        body.larger-elements .keys-indicator .key-left,
        body.larger-elements .keys-indicator .key-right {
            width: 40px;
            height: 40px;
            font-size: 1.2em;
        }
        
        /* Estilos para movimento reduzido quando ativado */
        body.reduced-motion * {
            animation-duration: 0.001s !important;
            transition-duration: 0.001s !important;
        }
    `;
    
    document.head.appendChild(styleElement);
    
    // Configura eventos
    const minimizeBtn = document.getElementById('minimizeAccessibility');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            accessibilityContainer.classList.toggle('minimized');
            minimizeBtn.textContent = accessibilityContainer.classList.contains('minimized') ? '□' : '_';
        });
    }
    
    // Torna o container arrastável
    const header = accessibilityContainer.querySelector('.accessibility-header');
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX;
    let initialY;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('minimize-btn')) return;
        
        isDragging = true;
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        header.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        accessibilityContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'grab';
    });
    
    // Implementa funcionalidade das opções
    const highContrastMode = document.getElementById('highContrastMode');
    const largerElements = document.getElementById('largerElements');
    const reducedMotion = document.getElementById('reducedMotion');
    const gameSpeed = document.getElementById('gameSpeed');
    
    if (highContrastMode) {
        highContrastMode.addEventListener('change', () => {
            document.body.classList.toggle('high-contrast', highContrastMode.checked);
        });
    }
    
    if (largerElements) {
        largerElements.addEventListener('change', () => {
            document.body.classList.toggle('larger-elements', largerElements.checked);
        });
    }
    
    if (reducedMotion) {
        reducedMotion.addEventListener('change', () => {
            document.body.classList.toggle('reduced-motion', reducedMotion.checked);
        });
    }
    
    if (gameSpeed) {
        gameSpeed.addEventListener('input', () => {
            const speed = parseFloat(gameSpeed.value);
            
            // Ajusta a velocidade para ambos os jogos
            if (window.game1 && window.game1.gameLoop) {
                clearInterval(window.game1.gameLoop);
                window.game1.gameLoop = setInterval(() => {
                    window.game1.update();
                }, 100 / speed);
            }
            
            if (window.game2 && window.game2.gameLoop) {
                clearInterval(window.game2.gameLoop);
                window.game2.gameLoop = setInterval(() => {
                    window.game2.update();
                }, 100 / speed);
            }
        });
    }
}

// Executa a configuração de acessibilidade
setTimeout(setupAccessibilityOptions, 3500);
