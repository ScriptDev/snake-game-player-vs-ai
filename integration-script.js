// Atualize o script.js com este script final para integrar todas as funcionalidades

/**
 * Verifica e integra todos os novos sistemas
 * Deve ser chamado após todos os outros sistemas estarem inicializados
 */
function integrateAllSystems() {
    console.log('Integrando todos os sistemas...');
    
    // Verifica se todos os sistemas necessários estão inicializados
    if (!window.game1 || !window.game2) {
        console.error('Jogos não inicializados corretamente!');
        return;
    }
    
    // Verifica se os jogadores têm as classes PlayerControls
    if (!window.game1.playerControls || !window.game2.playerControls) {
        console.log('Inicializando controles dos jogadores...');
        // Se não, inicializa-os
        window.game1.initPlayerControls();
        window.game2.initPlayerControls();
    }
    
    // Cria os indicadores de modo, se ainda não existirem
    const modeIndicator1 = document.getElementById('modeIndicator1');
    const modeIndicator2 = document.getElementById('modeIndicator2');
    
    if (!modeIndicator1 || !modeIndicator2) {
        setupModeIndicators();
    }
    
    // Ativa observadores de mudanças de modo, se ainda não estiverem ativos
    if (typeof observeControlModeChanges === 'function') {
        observeControlModeChanges();
    }
    
    // Melhora a experiência do jogador
    if (typeof enhancePlayerExperience === 'function') {
        enhancePlayerExperience();
    }
    
    // Adiciona botões para alternar rapidamente entre controles do jogador e IA
    function addQuickToggleButtons() {
        // Função para criar botões de alternância rápida
        const createQuickToggle = (gameNumber) => {
            const gameContainer = document.getElementById(`game${gameNumber}`);
            if (!gameContainer) return;
            
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'quick-toggle';
            toggleDiv.innerHTML = `
                <button class="quick-toggle-player" data-game="${gameNumber}">👤</button>
                <button class="quick-toggle-ai" data-game="${gameNumber}">🤖</button>
            `;
            
            gameContainer.appendChild(toggleDiv);
        };
        
        // Cria para ambos os jogos
        createQuickToggle(1);
        createQuickToggle(2);
        
        // Adiciona event listeners
        document.querySelectorAll('.quick-toggle-player').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameNumber = e.target.dataset.game;
                const game = window[`game${gameNumber}`];
                
                if (game.controlMode !== 'player') {
                    if (game.controlMode === 'ai') {
                        game.toggleAI();
                    }
                    game.togglePlayerControl();
                }
            });
        });
        
        document.querySelectorAll('.quick-toggle-ai').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameNumber = e.target.dataset.game;
                const game = window[`game${gameNumber}`];
                
                if (game.controlMode !== 'ai') {
                    if (game.controlMode === 'player') {
                        game.togglePlayerControl();
                    }
                    game.toggleAI();
                }
            });
        });
        
        // Adiciona estilos
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .quick-toggle {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 5px;
                z-index: 15;
            }
            
            .quick-toggle button {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                opacity: 0.7;
            }
            
            .quick-toggle button:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            
            .quick-toggle-player {
                background: rgba(255, 152, 0, 0.8);
            }
            
            .quick-toggle-ai {
                background: rgba(33, 150, 243, 0.8);
            }
            
            /* Estilo para botão ativo */
            .game-container[data-control="player"] .quick-toggle-player,
            .game-container[data-control="ai"] .quick-toggle-ai {
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                opacity: 1;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
    
    // Adiciona botões de alternância rápida
    addQuickToggleButtons();
    
    // Adiciona um indicador de teclas para ajudar o jogador
    function addKeysIndicator() {
        // Cria um indicador para jogador 1
        const keys1 = document.createElement('div');
        keys1.className = 'keys-indicator keys-indicator-1';
        keys1.innerHTML = `
            <div class="key-up">↑</div>
            <div class="key-horizontal">
                <div class="key-left">←</div>
                <div class="key-down">↓</div>
                <div class="key-right">→</div>
            </div>
        `;
        
        // Cria um indicador para jogador 2
        const keys2 = document.createElement('div');
        keys2.className = 'keys-indicator keys-indicator-2';
        keys2.innerHTML = `
            <div class="key-up">W</div>
            <div class="key-horizontal">
                <div class="key-left">A</div>
                <div class="key-down">S</div>
                <div class="key-right">D</div>
            </div>
        `;
        
        // Adiciona ao DOM
        document.getElementById('game1').appendChild(keys1);
        document.getElementById('game2').appendChild(keys2);
        
        // Adiciona estilos
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .keys-indicator {
                position: absolute;
                bottom: 80px;
                left: 20px;
                background: rgba(0, 0, 0, 0.7);
                padding: 5px;
                border-radius: 5px;
                display: flex;
                flex-direction: column;
                align-items: center;
                opacity: 0.5;
                transition: opacity 0.3s ease;
                z-index: 15;
            }
            
            .keys-indicator:hover {
                opacity: 1;
            }
            
            .key-horizontal {
                display: flex;
                align-items: center;
            }
            
            .key-up, .key-down, .key-left, .key-right {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                margin: 2px;
                color: white;
                font-weight: bold;
                user-select: none;
            }
            
            /* Mostra apenas quando o controle do jogador está ativo */
            .keys-indicator {
                display: none;
            }
            
            .game-container[data-control="player"] .keys-indicator {
                display: flex;
            }
            
            /* Destaca a tecla pressionada */
            .key-active {
                background: rgba(76, 175, 80, 0.8) !important;
            }
        `;
        
        document.head.appendChild(styleElement);
        
        // Adiciona event listeners para destacar teclas pressionadas
        document.addEventListener('keydown', (e) => {
            // Teclas para jogador 1
            if (window.game1.controlMode === 'player') {
                if (e.key === 'ArrowUp') {
                    document.querySelector('.keys-indicator-1 .key-up').classList.add('key-active');
                } else if (e.key === 'ArrowDown') {
                    document.querySelector('.keys-indicator-1 .key-down').classList.add('key-active');
                } else if (e.key === 'ArrowLeft') {
                    document.querySelector('.keys-indicator-1 .key-left').classList.add('key-active');
                } else if (e.key === 'ArrowRight') {
                    document.querySelector('.keys-indicator-1 .key-right').classList.add('key-active');
                }
            }
            
            // Teclas para jogador 2
            if (window.game2.controlMode === 'player') {
                if (e.key.toLowerCase() === 'w') {
                    document.querySelector('.keys-indicator-2 .key-up').classList.add('key-active');
                } else if (e.key.toLowerCase() === 's') {
                    document.querySelector('.keys-indicator-2 .key-down').classList.add('key-active');
                } else if (e.key.toLowerCase() === 'a') {
                    document.querySelector('.keys-indicator-2 .key-left').classList.add('key-active');
                } else if (e.key.toLowerCase() === 'd') {
                    document.querySelector('.keys-indicator-2 .key-right').classList.add('key-active');
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            // Teclas para jogador 1
            if (e.key === 'ArrowUp') {
                document.querySelector('.keys-indicator-1 .key-up').classList.remove('key-active');
            } else if (e.key === 'ArrowDown') {
                document.querySelector('.keys-indicator-1 .key-down').classList.remove('key-active');
            } else if (e.key === 'ArrowLeft') {
                document.querySelector('.keys-indicator-1 .key-left').classList.remove('key-active');
            } else if (e.key === 'ArrowRight') {
                document.querySelector('.keys-indicator-1 .key-right').classList.remove('key-active');
            }
            
            // Teclas para jogador 2
            if (e.key.toLowerCase() === 'w') {
                document.querySelector('.keys-indicator-2 .key-up').classList.remove('key-active');
            } else if (e.key.toLowerCase() === 's') {
                document.querySelector('.keys-indicator-2 .key-down').classList.remove('key-active');
            } else if (e.key.toLowerCase() === 'a') {
                document.querySelector('.keys-indicator-2 .key-left').classList.remove('key-active');
            } else if (e.key.toLowerCase() === 'd') {
                document.querySelector('.keys-indicator-2 .key-right').classList.remove('key-active');
            }
        });
    }
    
    // Adiciona indicadores de teclas
    addKeysIndicator();
    
    // Atualiza atributos de dados para estilização condicional
    function updateDataAttributes() {
        // Observa mudanças no modo de controle e atualiza os atributos de dados
        const observer = new MutationObserver(() => {
            if (window.game1) {
                document.getElementById('game1').setAttribute('data-control', window.game1.controlMode);
            }
            if (window.game2) {
                document.getElementById('game2').setAttribute('data-control', window.game2.controlMode);
            }
        });
        
        // Inicia a observação de mudanças no DOM
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Define os valores iniciais
        if (window.game1) {
            document.getElementById('game1').setAttribute('data-control', window.game1.controlMode);
        }
        if (window.game2) {
            document.getElementById('game2').setAttribute('data-control', window.game2.controlMode);
        }
    }
    
    // Atualiza atributos de dados
    updateDataAttributes();
    
    console.log('Todos os sistemas integrados com sucesso');
}

// Executa a integração após o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que todos os outros sistemas sejam inicializados
    setTimeout(() => {
        integrateAllSystems();
    }, 2000);
});