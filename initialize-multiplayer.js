// Adicione este código no final do script.js para inicializar o sistema de modo multijogador

/**
 * Inicializa o sistema de modo multijogador
 * Deve ser chamado após a inicialização dos jogos
 */
function initializeMultiplayerSystem() {
    console.log('Inicializando sistema de multijogador...');
    
    // Cria o gerenciador de modos de jogo
    window.gameModeManager = new GameModeManager();
    
    // Registra os jogos no gerenciador
    if (window.game1) window.gameModeManager.registerGame(window.game1);
    if (window.game2) window.gameModeManager.registerGame(window.game2);
    
    // Adiciona o botão de modo de jogo no menu principal
    const floatingControls = document.getElementById('floatingControls');
    if (floatingControls) {
        const gameControlsDiv = floatingControls.querySelector('.game-controls');
        
        // Adiciona separador de modos de jogo
        const modeSeparator = document.createElement('div');
        modeSeparator.className = 'controls-separator';
        modeSeparator.innerHTML = '<span class="separator-text">Modos de Jogo</span>';
        gameControlsDiv.appendChild(modeSeparator);
        
        // Adiciona botões de modos
        const modeButtons = document.createElement('div');
        modeButtons.className = 'mode-buttons';
        
        modeButtons.innerHTML = `
            <button id="standardModeBtn" class="mode-button active">Padrão</button>
            <button id="versusModeBtn" class="mode-button">Versus</button>
            <button id="tournamentModeBtn" class="mode-button">Torneio</button>
        `;
        
        gameControlsDiv.appendChild(modeButtons);
        
        // Configura os eventos dos botões
        const standardModeBtn = document.getElementById('standardModeBtn');
        const versusModeBtn = document.getElementById('versusModeBtn');
        const tournamentModeBtn = document.getElementById('tournamentModeBtn');
        
        // Lista de todos os botões de modo
        const allModeButtons = [standardModeBtn, versusModeBtn, tournamentModeBtn];
        
        // Função para atualizar a classe ativa
        const updateActiveButton = (activeButton) => {
            allModeButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            activeButton.classList.add('active');
        };
        
        // Configura os event listeners
        if (standardModeBtn) {
            standardModeBtn.addEventListener('click', () => {
                window.gameModeManager.cleanupCurrentMode();
                window.gameModeManager.setMode('standard');
                updateActiveButton(standardModeBtn);
            });
        }
        
        if (versusModeBtn) {
            versusModeBtn.addEventListener('click', () => {
                window.gameModeManager.cleanupCurrentMode();
                window.gameModeManager.setMode('versus');
                updateActiveButton(versusModeBtn);
            });
        }
        
        if (tournamentModeBtn) {
            tournamentModeBtn.addEventListener('click', () => {
                window.gameModeManager.cleanupCurrentMode();
                window.gameModeManager.setMode('tournament');
                updateActiveButton(tournamentModeBtn);
            });
        }
    }
    
    console.log('Sistema de multijogador inicializado com sucesso');
}

// Inicializa o sistema após o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
    // Precisamos aguardar os jogos estarem inicializados
    setTimeout(() => {
        initializeMultiplayerSystem();
    }, 1000);
});

/**
 * Adiciona estilos para os botões de modo de jogo
 */
function addModeButtonStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .mode-buttons {
            display: flex;
            gap: 5px;
            margin-top: 10px;
            width: 100%;
        }
        
        .mode-button {
            flex: 1;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: none;
            padding: 8px 5px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.8em;
            transition: all 0.3s ease;
        }
        
        .mode-button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        
        .mode-button.active {
            background: #4CAF50;
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
        }
        
        /* Estilos para o placar no modo versus */
        .versus-score-display {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 10px 20px;
            color: white;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            text-align: center;
        }
        
        .score-header {
            font-size: 1.2em;
            margin-bottom: 5px;
            color: #4CAF50;
        }
        
        .score-content {
            display: flex;
            gap: 20px;
            justify-content: center;
        }
        
        #player1Score, #player2Score {
            padding: 5px 10px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        #player1Score {
            background: rgba(255, 152, 0, 0.3);
        }
        
        #player2Score {
            background: rgba(33, 150, 243, 0.3);
        }
        
        .highlight {
            transform: scale(1.1);
            font-weight: bold;
        }
        
        #player1Score.highlight {
            background: rgba(255, 152, 0, 0.8);
        }
        
        #player2Score.highlight {
            background: rgba(33, 150, 243, 0.8);
        }
        
        /* Estilos para modal de vitória */
        .victory-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.5s ease;
        }
        
        .victory-content {
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #4CAF50;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            color: white;
            max-width: 400px;
        }
        
        .victory-content h2 {
            color: #4CAF50;
            font-size: 2em;
            margin-bottom: 20px;
        }
        
        .victory-content button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
            cursor: pointer;
            font-size: 1em;
            transition: all 0.3s ease;
        }
        
        .victory-content button:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
        
        /* Estilos para o torneio */
        .tournament-ui {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            color: white;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        .tournament-header {
            font-size: 1.2em;
            text-align: center;
            margin-bottom: 10px;
            color: #4CAF50;
        }
        
        .tournament-rounds {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
        }
        
        .tournament-standings {
            max-height: 150px;
            overflow-y: auto;
        }
        
        .standing-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 10px;
            margin: 2px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }
        
        .standing-position {
            width: 20px;
            text-align: right;
            margin-right: 10px;
        }
        
        .standing-name {
            flex: 1;
            margin: 0 10px;
        }
        
        .standing-score {
            font-weight: bold;
            color: #FFD700;
        }
        
        .tournament-result {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2001;
            animation: fadeIn 0.5s ease;
        }
        
        .result-content {
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #FFD700;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            color: white;
            max-width: 500px;
        }
        
        .result-content h2 {
            color: #FFD700;
            font-size: 2em;
            margin-bottom: 20px;
        }
        
        .final-standings {
            text-align: left;
            margin: 20px 0;
        }
        
        .final-standings h3 {
            color: #4CAF50;
            margin-bottom: 10px;
        }
        
        .final-standings ol {
            padding-left: 20px;
        }
        
        .final-standings li {
            margin: 5px 0;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Adiciona os estilos quando a página carrega
document.addEventListener('DOMContentLoaded', addModeButtonStyles);
