// Adicionando esta nova seção à classe Game em game.js

// Adicione este método à classe Game
initPlayerControls() {
    this.playerControls = new PlayerControls(this, this.canvas.id.slice(-1));
    
    // Adiciona uma propriedade para rastrear se o controle está com o jogador ou IA
    this.controlMode = 'none'; // Valores possíveis: 'none', 'player', 'ai'
}

// Modifique o método toggleAI existente
toggleAI() {
    // Se o controle do jogador estiver ativo, desative-o primeiro
    if (this.controlMode === 'player' && this.playerControls) {
        this.playerControls.deactivate();
    }
    
    this.isActive = !this.isActive;
    console.log("IA " + (this.isActive ? "Ativada" : "Desativada"));
    
    const gameNumber = this.canvas.id.slice(-1);
    const aiButton = document.getElementById(`aiBtn${gameNumber}`);
    
    if (this.isActive) {
        aiButton.textContent = `IA ${gameNumber} ON`;
        aiButton.classList.add('ai-active');
        this.controlMode = 'ai';
        this.chat.addSystemMessage(`IA ${gameNumber} ativada! 🤖`);
    } else {
        aiButton.textContent = `IA ${gameNumber}`;
        aiButton.classList.remove('ai-active');
        this.controlMode = 'none';
        this.chat.addSystemMessage(`IA ${gameNumber} desativada! 🔌`);
    }
}

// Adicione este novo método para alternar o controle do jogador
togglePlayerControl() {
    // Se a IA estiver ativa, desative-a primeiro
    if (this.controlMode === 'ai' && this.isActive) {
        this.toggleAI();
    }
    
    const gameNumber = this.canvas.id.slice(-1);
    const playerButton = document.getElementById(`playerBtn${gameNumber}`);
    
    if (this.controlMode !== 'player') {
        // Ativa controle do jogador
        this.playerControls.activate();
        this.controlMode = 'player';
        playerButton.textContent = `Jogador ${gameNumber} ON`;
        playerButton.classList.add('player-active');
    } else {
        // Desativa controle do jogador
        this.playerControls.deactivate();
        this.controlMode = 'none';
        playerButton.textContent = `Jogador ${gameNumber}`;
        playerButton.classList.remove('player-active');
    }
}

// Modifique o método start da classe Game para incluir a inicialização dos controles do jogador
start() {
    console.log(`Iniciando jogo ${this.canvas.id}...`);

    // Limpa o loop anterior se existir
    if (this.gameLoop) {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
    }

    // Reinicia a cobra com algumas células
    this.snake = {
        x: 15,
        y: 15,
        dx: 1,
        dy: 0,
        cells: [{x: 15, y: 15}, {x: 14, y: 15}, {x: 13, y: 15}, {x: 12, y: 15}],
        maxCells: 4,
        growthCounter: 0
    };
    
    // Reinicia valores
    this.gold = 0;
    this.xp = 0;
    this.level = 1;
    this.obstacles = new Map();
    this.parasites = [];
    this.controlMode = 'none';

    // Inicializa os controles do jogador se ainda não estiverem inicializados
    if (!this.playerControls) {
        this.initPlayerControls();
    } else {
        // Desativa os controles do jogador ao reiniciar
        this.playerControls.deactivate();
    }

    // Desativa a IA ao reiniciar
    this.ai.isActive = false;

    // Nova posição para a comida
    this.food = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
    };

    // Atualiza a interface
    this.updateStats();

    // Força um desenho inicial
    this.clear();
    this.drawFood();
    this.drawSnake();

    // Inicia o loop do jogo
    this.gameLoop = setInterval(() => {
        this.update();
    }, 100);

    console.log(`Jogo ${this.canvas.id} iniciado com sucesso`);
}

// Modifique o método gameOver da classe Game
gameOver() {
    // Para o loop do jogo
    if (this.gameLoop) {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
    }

    const gameNumber = this.canvas.id.slice(-1);
    
    // Desativa a IA se estiver ativa
    if (this.controlMode === 'ai' && this.ai.isActive) {
        this.ai.isActive = false;
        document.getElementById(`aiBtn${gameNumber}`).textContent = 'IA ' + gameNumber;
        document.getElementById(`aiBtn${gameNumber}`).classList.remove('ai-active');
    }
    
    // Desativa os controles do jogador se estiverem ativos
    if (this.controlMode === 'player' && this.playerControls) {
        this.playerControls.deactivate();
        document.getElementById(`playerBtn${gameNumber}`).textContent = 'Jogador ' + gameNumber;
        document.getElementById(`playerBtn${gameNumber}`).classList.remove('player-active');
    }
    
    this.controlMode = 'none';
    
    // Cria o botão de reiniciar
    const gameContainer = document.getElementById(`game${gameNumber}`);
    if (gameContainer) {
        // Remove botão anterior se existir
        const existingButton = gameContainer.querySelector('.restart-button');
        if (existingButton) {
            existingButton.remove();
        }

        // Cria novo botão
        const restartButton = document.createElement('button');
        restartButton.className = 'restart-button';
        restartButton.textContent = `Reiniciar Jogo ${gameNumber}`;
        restartButton.onclick = () => {
            restartButton.remove(); // Remove o botão ao clicar
            this.start(); // Reinicia o jogo
        };

        // Adiciona o botão ao container do jogo
        gameContainer.appendChild(restartButton);

        // Adiciona mensagem ao chat
        this.chat.onDeath(gameNumber, this.gold);
        this.chat.addSystemMessage(`Snake ${gameNumber} morreu! Clique no botão para reiniciar.`);
    }
}
