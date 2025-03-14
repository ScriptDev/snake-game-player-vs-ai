/**
 * Sistema de Dificuldade
 * Permite ajustar a dificuldade do jogo com diferentes níveis
 */
class DifficultySystem {
    constructor() {
        this.difficultyLevels = {
            easy: {
                name: "Fácil",
                snakeSpeed: 150, // ms entre cada atualização (mais alto = mais lento)
                aiReactionTime: 200, // ms de intervalo da IA (mais alto = mais lento)
                aiPrecision: 0.7, // precisão da IA (1 = perfeita, 0 = aleatória)
                obstacleFrequency: 0.2, // frequência de geração de obstáculos
                parasiteSpeed: 0.4, // velocidade dos parasitas
                description: "Ideal para iniciantes. Cobra mais lenta, IA menos precisa."
            },
            medium: {
                name: "Médio",
                snakeSpeed: 100,
                aiReactionTime: 120,
                aiPrecision: 0.85,
                obstacleFrequency: 0.4,
                parasiteSpeed: 0.6,
                description: "Desafio equilibrado para jogadores intermediários."
            },
            hard: {
                name: "Difícil",
                snakeSpeed: 70,
                aiReactionTime: 80,
                aiPrecision: 0.95,
                obstacleFrequency: 0.6,
                parasiteSpeed: 0.8,
                description: "Para jogadores experientes. Cobra mais rápida, IA quase perfeita."
            },
            expert: {
                name: "Especialista",
                snakeSpeed: 50,
                aiReactionTime: 50,
                aiPrecision: 0.98,
                obstacleFrequency: 0.8,
                parasiteSpeed: 1.0,
                description: "Desafio extremo. Velocidade máxima, IA com precisão quase perfeita."
            }
        };
        
        this.currentDifficulty = 'medium'; // Dificuldade padrão
        this.createDifficultySelector();
    }
    
    createDifficultySelector() {
        // Cria o seletor de dificuldade
        const difficultySelector = document.createElement('div');
        difficultySelector.className = 'difficulty-selector';
        difficultySelector.innerHTML = `
            <div class="difficulty-header">
                <span>🎚️ Dificuldade</span>
                <button class="minimize-btn" id="minimizeDifficulty">_</button>
            </div>
            <div class="difficulty-content">
                <div class="difficulty-options">
                    <button class="difficulty-btn" data-level="easy">Fácil</button>
                    <button class="difficulty-btn active" data-level="medium">Médio</button>
                    <button class="difficulty-btn" data-level="hard">Difícil</button>
                    <button class="difficulty-btn" data-level="expert">Especialista</button>
                </div>
                <div class="difficulty-description">Desafio equilibrado para jogadores intermediários.</div>
            </div>
        `;
        
        document.body.appendChild(difficultySelector);
        
        // Configura os eventos
        const buttons = difficultySelector.querySelectorAll('.difficulty-btn');
        const descriptionDiv = difficultySelector.querySelector('.difficulty-description');
        const minimizeBtn = difficultySelector.querySelector('#minimizeDifficulty');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const level = button.dataset.level;
                this.setDifficulty(level);
                
                // Atualiza os botões
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Atualiza a descrição
                descriptionDiv.textContent = this.difficultyLevels[level].description;
            });
        });
        
        // Configura botão de minimizar
        minimizeBtn.addEventListener('click', () => {
            difficultySelector.classList.toggle('minimized');
            minimizeBtn.textContent = difficultySelector.classList.contains('minimized') ? '□' : '_';
        });
        
        // Torna o seletor arrastável
        this.makeDraggable(difficultySelector);
        
        // Adiciona estilos
        this.addDifficultyStyles();
    }
    
    makeDraggable(element) {
        const header = element.querySelector('.difficulty-header');
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
            
            element.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });
    }
    
    setDifficulty(level) {
        if (!this.difficultyLevels[level]) {
            console.error(`Nível de dificuldade não reconhecido: ${level}`);
            return;
        }
        
        const previousLevel = this.currentDifficulty;
        this.currentDifficulty = level;
        
        // Aplica as configurações aos jogos
        if (window.game1) this.applyDifficultyToGame(window.game1, level);
        if (window.game2) this.applyDifficultyToGame(window.game2, level);
        
        // Notifica o usuário
        if (window.snakeChat) {
            const levelInfo = this.difficultyLevels[level];
            window.snakeChat.addSystemMessage(`Dificuldade alterada para: ${levelInfo.name} 🎚️`);
        }
        
        console.log(`Dificuldade alterada de ${previousLevel} para ${level}`);
    }
    
    applyDifficultyToGame(game, level) {
        if (!game || !game.gameLoop) return;
        
        const diffSettings = this.difficultyLevels[level];
        
        // Ajusta a velocidade da cobra
        clearInterval(game.gameLoop);
        game.gameLoop = setInterval(() => {
            game.update();
        }, diffSettings.snakeSpeed);
        
        // Ajusta a IA
        if (game.ai) {
            // Ajusta o tempo de reação da IA
            if (game.ai.thinkingInterval) {
                clearInterval(game.ai.thinkingInterval);
                
                if (game.ai.isActive) {
                    game.ai.thinkingInterval = setInterval(() => {
                        if (game.ai.isActive && game.gameLoop) {
                            game.ai.makeDecision();
                        }
                    }, diffSettings.aiReactionTime);
                }
            }
            
            // Ajusta a precisão da IA
            if (game.ai.vision) {
                game.ai.vision.detectionPrecision = diffSettings.aiPrecision;
            }
        }
        
        // Ajusta os parasitas
        if (game.parasites && game.parasites.length > 0) {
            game.parasites.forEach(parasite => {
                parasite.speed = diffSettings.parasiteSpeed;
            });
        }
        
        // Define a frequência de geração de obstáculos
        game.obstacleFrequency = diffSettings.obstacleFrequency;
    }
    
    addDifficultyStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .difficulty-selector {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 250px;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: white;
                z-index: 1000;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease;
            }
            
            .difficulty-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px 10px 0 0;
                cursor: grab;
            }
            
            .difficulty-content {
                padding: 15px;
            }
            
            .difficulty-options {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 10px;
            }
            
            .difficulty-btn {
                flex: 1;
                min-width: 70px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9em;
            }
            
            .difficulty-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .difficulty-btn.active {
                background: #4CAF50;
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
            }
            
            .difficulty-description {
                font-size: 0.9em;
                margin-top: 10px;
                background: rgba(0, 0, 0, 0.3);
                padding: 10px;
                border-radius: 5px;
                line-height: 1.4;
            }
            
            .difficulty-selector.minimized .difficulty-content {
                display: none;
            }
            
            /* Transição ao mudar de dificuldade */
            @keyframes difficultyChange {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            .game-container {
                transition: all 0.3s ease;
            }
            
            .game-container.difficulty-changing {
                animation: difficultyChange 0.5s ease;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
    
    getCurrentSettings() {
        return this.difficultyLevels[this.currentDifficulty];
    }
}

/**
 * Inicializa o sistema de dificuldade
 */
function initializeDifficultySystem() {
    // Cria a instância do sistema de dificuldade
    window.difficultySystem = new DifficultySystem();
    
    console.log('Sistema de dificuldade inicializado com sucesso');
}

// Inicializa o sistema após o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
    // Espera um pouco para garantir que outros elementos foram inicializados
    setTimeout(() => {
        initializeDifficultySystem();
    }, 1800);
});