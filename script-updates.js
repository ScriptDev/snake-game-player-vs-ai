// Adicione esta função ao script.js para configurar os novos controles
function setupPlayerControls() {
    console.log('Configurando controles dos jogadores...');
    
    // Botões de jogador
    const playerBtn1 = document.getElementById('playerBtn1');
    const playerBtn2 = document.getElementById('playerBtn2');
    
    if (playerBtn1) {
        playerBtn1.addEventListener('click', () => {
            if (window.game1) {
                window.game1.togglePlayerControl();
            }
        });
    } else {
        console.error('Botão do jogador 1 não encontrado');
    }
    
    if (playerBtn2) {
        playerBtn2.addEventListener('click', () => {
            if (window.game2) {
                window.game2.togglePlayerControl();
            }
        });
    } else {
        console.error('Botão do jogador 2 não encontrado');
    }
    
    console.log('Controles dos jogadores configurados com sucesso');
}

// Configure o modal de ajuda
function setupHelpModal() {
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.getElementById('closeHelp');
    const startGameBtn = document.getElementById('startGameBtn');
    
    if (!helpButton || !helpModal || !closeHelp || !startGameBtn) {
        console.error('Elementos de ajuda não encontrados');
        return;
    }
    
    // Exibe o modal quando clicar no botão de ajuda
    helpButton.addEventListener('click', () => {
        helpModal.classList.add('show');
    });
    
    // Fecha o modal quando clicar no botão X
    closeHelp.addEventListener('click', () => {
        helpModal.classList.remove('show');
    });
    
    // Fecha o modal quando clicar no botão de jogar
    startGameBtn.addEventListener('click', () => {
        helpModal.classList.remove('show');
    });
    
    // Fecha o modal quando clicar fora dele
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('show');
        }
    });
}

// Adicione indicadores de modo de jogo
function setupModeIndicators() {
    const game1Container = document.getElementById('game1');
    const game2Container = document.getElementById('game2');
    
    // Cria indicadores para o Jogo 1
    const indicator1 = document.createElement('div');
    indicator1.className = 'mode-indicator';
    indicator1.id = 'modeIndicator1';
    indicator1.textContent = 'Modo: Manual';
    game1Container.appendChild(indicator1);
    
    // Cria indicadores para o Jogo 2
    const indicator2 = document.createElement('div');
    indicator2.className = 'mode-indicator';
    indicator2.id = 'modeIndicator2';
    indicator2.textContent = 'Modo: Manual';
    game2Container.appendChild(indicator2);
}

// Atualize os indicadores de modo
function updateModeIndicator(gameNumber, mode) {
    const indicator = document.getElementById(`modeIndicator${gameNumber}`);
    if (!indicator) return;
    
    // Reseta as classes
    indicator.className = 'mode-indicator';
    
    switch(mode) {
        case 'none':
            indicator.textContent = 'Modo: Manual';
            break;
        case 'player':
            indicator.textContent = 'Modo: Jogador';
            indicator.classList.add('mode-player');
            break;
        case 'ai':
            indicator.textContent = 'Modo: IA';
            indicator.classList.add('mode-ai');
            break;
    }
}

// Modifique o evento DOMContentLoaded para incluir as novas configurações
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os jogos
    window.game1 = new Game('gameCanvas1');
    window.game2 = new Game('gameCanvas2');

    // Conecta os jogos entre si
    game1.connectGames(game2);
    game2.connectGames(game1);

    // Configura os botões de IA
    const aiBtn1 = document.getElementById('aiBtn1');
    const aiBtn2 = document.getElementById('aiBtn2');

    aiBtn1.addEventListener('click', () => {
        game1.toggleAI();
        updateModeIndicator(1, game1.controlMode);
    });

    aiBtn2.addEventListener('click', () => {
        game2.toggleAI();
        updateModeIndicator(2, game2.controlMode);
    });

    // Configura os controles dos jogadores
    setupPlayerControls();

    // Configura o modal de ajuda
    setupHelpModal();
    
    // Configura os indicadores de modo
    setupModeIndicators();

    // Configura o botão de iniciar ambos os jogos
    const startBothBtn = document.getElementById('startBothBtn');
    startBothBtn.addEventListener('click', () => {
        if (window.game1 && window.game2) {
            game1.start();
            game2.start();
            startBothBtn.textContent = 'Reiniciar Jogos';
            
            // Atualiza os indicadores de modo
            updateModeIndicator(1, game1.controlMode);
            updateModeIndicator(2, game2.controlMode);
            
            // Exibe uma mensagem para guiar o jogador
            if (window.snakeChat) {
                window.snakeChat.addSystemMessage('Jogos iniciados! Escolha entre controle manual, jogador ou IA 🎮');
            }
        }
    });

    // Inicializa a God AI
    window.godAI = new GodAI(window.game1, window.game2);

    // Configura todas as janelas flutuantes
    setupFloatingWindows();

    // Inicializa o sistema de súplicas
    window.mercyRequests = new MercyRequests();
    
    // Mostrar modal de ajuda na primeira vez
    setTimeout(() => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            helpModal.classList.add('show');
        }
    }, 1000);
});