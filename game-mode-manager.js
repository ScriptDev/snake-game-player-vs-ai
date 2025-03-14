/**
 * Gerenciador de Modos de Jogo
 * Classe responsável por gerenciar os diferentes modos de jogo e facilitar a transição entre eles.
 */
class GameModeManager {
    constructor() {
        this.games = [];
        this.currentMode = 'standard'; // standard, versus, tournament, etc.
        
        // Configurações dos modos de jogo
        this.modeConfigs = {
            standard: {
                description: 'Modo padrão: Cada jogador/IA controla uma cobra independentemente',
                setupFunction: this.setupStandardMode.bind(this)
            },
            versus: {
                description: 'Modo versus: Jogador vs IA ou Jogador vs Jogador',
                setupFunction: this.setupVersusMode.bind(this)
            },
            tournament: {
                description: 'Modo torneio: Competição entre múltiplas IAs e jogadores',
                setupFunction: this.setupTournamentMode.bind(this)
            }
        };
        
        // Cria a interface do seletor de modos
        this.createModeSelector();
    }
    
    // Registra um jogo no gerenciador
    registerGame(game) {
        this.games.push(game);
        console.log(`Jogo registrado: ${game.canvas.id}`);
    }
    
    // Cria a interface do seletor de modos
    createModeSelector() {
        const selector = document.createElement('div');
        selector.className = 'mode-selector';
        selector.innerHTML = `
            <div class="mode-selector-header">
                <span>🎮 Modos de Jogo</span>
                <button class="minimize-btn">_</button>
            </div>
            <div class="mode-selector-content">
                <select id="gameModeSelect">
                    <option value="standard">Padrão</option>
                    <option value="versus">Versus</option>
                    <option value="tournament">Torneio</option>
                </select>
                <div id="modeDescription">Modo padrão: Cada jogador/IA controla uma cobra independentemente</div>
                <button id="applyModeBtn">Aplicar Modo</button>
            </div>
        `;
        
        document.body.appendChild(selector);
        
        // Configura os event listeners
        const selectElement = selector.querySelector('#gameModeSelect');
        const descriptionElement = selector.querySelector('#modeDescription');
        const applyButton = selector.querySelector('#applyModeBtn');
        const minimizeBtn = selector.querySelector('.minimize-btn');
        
        // Atualiza a descrição quando o modo for alterado
        selectElement.addEventListener('change', () => {
            const selectedMode = selectElement.value;
            descriptionElement.textContent = this.modeConfigs[selectedMode].description;
        });
        
        // Aplica o modo quando o botão for clicado
        applyButton.addEventListener('click', () => {
            const selectedMode = selectElement.value;
            this.setMode(selectedMode);
        });
        
        // Minimiza/Maximiza o seletor
        minimizeBtn.addEventListener('click', () => {
            selector.classList.toggle('minimized');
            minimizeBtn.textContent = selector.classList.contains('minimized') ? '□' : '_';
        });
        
        // Torna o seletor arrastável
        this.makeDraggable(selector);
    }
    
    // Torna um elemento arrastável
    makeDraggable(element) {
        const header = element.querySelector('.mode-selector-header');
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
    
    // Define o modo de jogo
    setMode(mode) {
        if (!this.modeConfigs[mode]) {
            console.error(`Modo não reconhecido: ${mode}`);
            return;
        }
        
        this.currentMode = mode;
        
        // Reinicia todos os jogos
        this.games.forEach(game => {
            // Se o jogo estiver em execução, reinicia-o
            if (game.gameLoop) {
                game.gameOver();
                game.start();
            }
        });
        
        // Configura o modo escolhido
        this.modeConfigs[mode].setupFunction();
        
        // Notifica o usuário
        if (window.snakeChat) {
            window.snakeChat.addSystemMessage(`Modo de jogo alterado para: ${mode.toUpperCase()} ⚙️`);
        }
        
        console.log(`Modo de jogo definido para: ${mode}`);
    }
    
    // Função de configuração do modo padrão
    setupStandardMode() {
        // No modo padrão, cada jogo funciona independentemente
        this.games.forEach(game => {
            // Retorna o jogo para o estado padrão
            // Qualquer configuração específica do modo anterior é limpa
        });
    }
    
    // Função de configuração do modo versus
    setupVersusMode() {
        if (this.games.length < 2) return;
        
        // Configura o primeiro jogo para jogador humano
        const game1 = this.games[0];
        if (game1.controlMode === 'ai') {
            game1.toggleAI();
        }
        if (game1.controlMode !== 'player') {
            game1.togglePlayerControl();
        }
        
        // Configura o segundo jogo para IA
        const game2 = this.games[1];
        if (game2.controlMode === 'player') {
            game2.togglePlayerControl();
        }
        if (game2.controlMode !== 'ai') {
            game2.toggleAI();
        }
        
        // Configura eventos especiais para o modo versus
        this.setupVersusEvents(game1, game2);
    }
    
    // Configuração de eventos especiais para o modo versus
    setupVersusEvents(game1, game2) {
        // Acompanha a pontuação de cada jogador
        let player1Score = 0;
        let player2Score = 0;
        
        // Cria elementos de pontuação na interface
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'versus-score-display';
        scoreDisplay.innerHTML = `
            <div class="score-header">Placar</div>
            <div class="score-content">
                <div id="player1Score">Jogador: ${player1Score}</div>
                <div id="player2Score">IA: ${player2Score}</div>
            </div>
        `;
        document.body.appendChild(scoreDisplay);
        
        // Atualiza o placar quando um jogador coletar comida
        const originalCheckFoodCollision1 = game1.checkFoodCollision;
        game1.checkFoodCollision = function() {
            const hadCollision = (this.snake.x === this.food.x && this.snake.y === this.food.y);
            originalCheckFoodCollision1.call(this);
            if (hadCollision) {
                player1Score++;
                document.getElementById('player1Score').textContent = `Jogador: ${player1Score}`;
                document.getElementById('player1Score').classList.add('highlight');
                setTimeout(() => {
                    document.getElementById('player1Score').classList.remove('highlight');
                }, 500);
                
                // Verifica vitória
                checkVictory();
            }
        };
        
        const originalCheckFoodCollision2 = game2.checkFoodCollision;
        game2.checkFoodCollision = function() {
            const hadCollision = (this.snake.x === this.food.x && this.snake.y === this.food.y);
            originalCheckFoodCollision2.call(this);
            if (hadCollision) {
                player2Score++;
                document.getElementById('player2Score').textContent = `IA: ${player2Score}`;
                document.getElementById('player2Score').classList.add('highlight');
                setTimeout(() => {
                    document.getElementById('player2Score').classList.remove('highlight');
                }, 500);
                
                // Verifica vitória
                checkVictory();
            }
        };
        
        // Função para verificar vitória
        const checkVictory = () => {
            const victoryScore = 10; // Pontuação para vencer
            
            if (player1Score >= victoryScore) {
                this.showVictoryMessage('Jogador');
                resetScores();
            } else if (player2Score >= victoryScore) {
                this.showVictoryMessage('IA');
                resetScores();
            }
        };
        
        // Função para resetar placar
        const resetScores = () => {
            player1Score = 0;
            player2Score = 0;
            document.getElementById('player1Score').textContent = `Jogador: ${player1Score}`;
            document.getElementById('player2Score').textContent = `IA: ${player2Score}`;
        };
        
        // Armazena as funções originais para restaurar depois
        game1.originalCheckFoodCollision = originalCheckFoodCollision1;
        game2.originalCheckFoodCollision = originalCheckFoodCollision2;
        
        // Armazena a referência para remover depois
        this.versusScoreDisplay = scoreDisplay;
    }
    
    // Exibe mensagem de vitória
    showVictoryMessage(winner) {
        const victoryModal = document.createElement('div');
        victoryModal.className = 'victory-modal';
        victoryModal.innerHTML = `
            <div class="victory-content">
                <h2>${winner} venceu!</h2>
                <p>Parabéns! ${winner} alcançou a pontuação necessária para vencer!</p>
                <button id="continueBtn">Continuar</button>
            </div>
        `;
        
        document.body.appendChild(victoryModal);
        
        // Botão para fechar o modal
        victoryModal.querySelector('#continueBtn').addEventListener('click', () => {
            victoryModal.remove();
        });
        
        // Notifica no chat
        if (window.snakeChat) {
            window.snakeChat.addSystemMessage(`🏆 ${winner} venceu a partida! 🏆`);
        }
    }
    
    // Função de configuração do modo torneio
    setupTournamentMode() {
        // No modo torneio, configura todas as cobras para serem controladas por IAs
        this.games.forEach(game => {
            if (game.controlMode === 'player') {
                game.togglePlayerControl();
            }
            if (game.controlMode !== 'ai') {
                game.toggleAI();
            }
        });
        
        // Configurações adicionais do modo torneio
        this.setupTournamentUI();
    }
    
    // Configura a UI do modo torneio
    setupTournamentUI() {
        const tournamentUI = document.createElement('div');
        tournamentUI.className = 'tournament-ui';
        tournamentUI.innerHTML = `
            <div class="tournament-header">Modo Torneio</div>
            <div class="tournament-rounds">
                <div class="round-info">Rodada: <span id="roundNumber">1</span></div>
                <div class="round-timer">Tempo: <span id="roundTimer">60</span>s</div>
            </div>
            <div class="tournament-standings">
                <div class="standing-item">
                    <span class="standing-position">1.</span>
                    <span class="standing-name">Snake IA 1</span>
                    <span class="standing-score">0</span>
                </div>
                <div class="standing-item">
                    <span class="standing-position">2.</span>
                    <span class="standing-name">Snake IA 2</span>
                    <span class="standing-score">0</span>
                </div>
                <!-- Mais cobras podem ser adicionadas aqui -->
            </div>
        `;
        
        document.body.appendChild(tournamentUI);
        
        // Inicia a primeira rodada
        this.startTournamentRound(1);
    }
    
    // Inicia uma rodada do torneio
    startTournamentRound(roundNumber) {
        // Atualiza o número da rodada
        document.getElementById('roundNumber').textContent = roundNumber;
        
        // Define o tempo da rodada (em segundos)
        let remainingTime = 60;
        document.getElementById('roundTimer').textContent = remainingTime;
        
        // Inicia o temporizador
        const timerInterval = setInterval(() => {
            remainingTime--;
            document.getElementById('roundTimer').textContent = remainingTime;
            
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                this.endTournamentRound(roundNumber);
            }
        }, 1000);
    }
    
    // Finaliza uma rodada do torneio
    endTournamentRound(roundNumber) {
        // Calcula pontuações
        const scores = this.games.map(game => ({
            name: `Snake ${game.canvas.id.slice(-1)}`,
            score: game.gold,
            length: game.snake.cells.length
        }));
        
        // Ordena por pontuação
        scores.sort((a, b) => b.score - a.score);
        
        // Atualiza a classificação
        const standingItems = document.querySelectorAll('.standing-item');
        scores.forEach((score, index) => {
            if (standingItems[index]) {
                standingItems[index].querySelector('.standing-name').textContent = score.name;
                standingItems[index].querySelector('.standing-score').textContent = score.score;
            }
        });
        
        // Reinicia os jogos para a próxima rodada
        this.games.forEach(game => {
            game.gameOver();
            game.start();
        });
        
        // Inicia a próxima rodada
        if (roundNumber < 3) { // Total de 3 rodadas
            this.startTournamentRound(roundNumber + 1);
        } else {
            this.endTournament(scores);
        }
    }
    
    // Finaliza o torneio
    endTournament(finalScores) {
        // Exibe o resultado final
        const winner = finalScores[0];
        
        const tournamentResult = document.createElement('div');
        tournamentResult.className = 'tournament-result';
        tournamentResult.innerHTML = `
            <div class="result-content">
                <h2>Torneio Finalizado!</h2>
                <p>Vencedor: ${winner.name} com ${winner.score} pontos!</p>
                <div class="final-standings">
                    <h3>Classificação Final:</h3>
                    <ol>
                        ${finalScores.map(s => `<li>${s.name}: ${s.score} pontos</li>`).join('')}
                    </ol>
                </div>
                <button id="closeResultBtn">Fechar</button>
            </div>
        `;
        
        document.body.appendChild(tournamentResult);
        
        // Botão para fechar o resultado
        tournamentResult.querySelector('#closeResultBtn').addEventListener('click', () => {
            tournamentResult.remove();
            
            // Remove a UI do torneio
            document.querySelector('.tournament-ui').remove();
            
            // Volta para o modo padrão
            this.setMode('standard');
        });
        
        // Notifica no chat
        if (window.snakeChat) {
            window.snakeChat.addSystemMessage(`🏆 Torneio finalizado! ${winner.name} venceu com ${winner.score} pontos! 🏆`);
        }
    }
    
    // Limpa elementos específicos do modo quando trocamos de modo
    cleanupCurrentMode() {
        // Limpa elementos do modo versus
        if (this.versusScoreDisplay) {
            this.versusScoreDisplay.remove();
            this.versusScoreDisplay = null;
        }
        
        // Limpa elementos do modo torneio
        const tournamentUI = document.querySelector('.tournament-ui');
        if (tournamentUI) {
            tournamentUI.remove();
        }
        
        const tournamentResult = document.querySelector('.tournament-result');
        if (tournamentResult) {
            tournamentResult.remove();
        }
        
        // Restaura funções originais dos jogos
        this.games.forEach(game => {
            if (game.originalCheckFoodCollision) {
                game.checkFoodCollision = game.originalCheckFoodCollision;
                game.originalCheckFoodCollision = null;
            }
        });
    }
}