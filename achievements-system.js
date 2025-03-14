/**
 * Sistema de Conquistas
 * Rastreia o progresso do jogador e concede conquistas com base em marcos alcançados
 */
class AchievementsSystem {
    constructor() {
        this.achievements = [
            // Conquistas relacionadas à comida
            {
                id: 'food_collector_1',
                name: 'Colecionador de Petiscos',
                description: 'Colete 10 comidas com uma única cobra',
                icon: '🍎',
                condition: (stats) => stats.foodCollected >= 10,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'food_collector_2',
                name: 'Glutão',
                description: 'Colete 25 comidas com uma única cobra',
                icon: '🍔',
                condition: (stats) => stats.foodCollected >= 25,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'food_collector_3',
                name: 'Devorador Insaciável',
                description: 'Colete 50 comidas com uma única cobra',
                icon: '🍕',
                condition: (stats) => stats.foodCollected >= 50,
                awarded: { game1: false, game2: false }
            },
            
            // Conquistas relacionadas ao tamanho
            {
                id: 'snake_size_1',
                name: 'Cobra Crescente',
                description: 'Alcance um tamanho de 10 segmentos',
                icon: '🐍',
                condition: (stats) => stats.maxLength >= 10,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'snake_size_2',
                name: 'Anaconda',
                description: 'Alcance um tamanho de 20 segmentos',
                icon: '🐉',
                condition: (stats) => stats.maxLength >= 20,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'snake_size_3',
                name: 'Titanoboa',
                description: 'Alcance um tamanho de 30 segmentos',
                icon: '🏆',
                condition: (stats) => stats.maxLength >= 30,
                awarded: { game1: false, game2: false }
            },
            
            // Conquistas relacionadas ao nível
            {
                id: 'level_up_1',
                name: 'Iniciante',
                description: 'Alcance o nível 5',
                icon: '⭐',
                condition: (stats) => stats.maxLevel >= 5,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'level_up_2',
                name: 'Competente',
                description: 'Alcance o nível 10',
                icon: '🌟',
                condition: (stats) => stats.maxLevel >= 10,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'level_up_3',
                name: 'Mestre das Serpentes',
                description: 'Alcance o nível 15',
                icon: '👑',
                condition: (stats) => stats.maxLevel >= 15,
                awarded: { game1: false, game2: false }
            },
            
            // Conquistas relacionadas ao modo de controle
            {
                id: 'control_master',
                name: 'Híbrido',
                description: 'Jogue como Jogador e IA na mesma sessão',
                icon: '🎮',
                condition: (stats) => stats.playerControlTime > 30 && stats.aiControlTime > 30,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'human_player',
                name: 'Jogador Dedicado',
                description: 'Jogue manualmente por mais de 5 minutos',
                icon: '👤',
                condition: (stats) => stats.playerControlTime > 300,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'ai_observer',
                name: 'Espectador da IA',
                description: 'Observe a IA jogar por mais de 5 minutos',
                icon: '🤖',
                condition: (stats) => stats.aiControlTime > 300,
                awarded: { game1: false, game2: false }
            },
            
            // Conquistas relacionadas às pontuações
            {
                id: 'score_1',
                name: 'Caçador de Gold',
                description: 'Acumule 500 pontos de gold',
                icon: '💰',
                condition: (stats) => stats.totalScore >= 500,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'score_2',
                name: 'Tesouro da Serpente',
                description: 'Acumule 1000 pontos de gold',
                icon: '💎',
                condition: (stats) => stats.totalScore >= 1000,
                awarded: { game1: false, game2: false }
            },
            
            // Conquistas de persistência
            {
                id: 'survivor',
                name: 'Sobrevivente',
                description: 'Sobreviva por mais de 3 minutos sem morrer',
                icon: '⏱️',
                condition: (stats) => stats.timeAlive > 180,
                awarded: { game1: false, game2: false }
            },
            {
                id: 'phoenix',
                name: 'Fênix',
                description: 'Morra e renasça 5 vezes',
                icon: '🔥',
                condition: (stats) => stats.deaths >= 5,
                awarded: { game1: false, game2: false }
            },
            
            // Conquistas colaborativas (sessão)
            {
                id: 'team_effort',
                name: 'Esforço em Equipe',
                description: 'Colete um total de 50 comidas com ambas as cobras durante a sessão',
                icon: '🤝',
                condition: (stats) => stats.foodCollected >= 50,
                awarded: { session: false }
            }
        ];
        
        // Carrega conquistas salvas, se existirem
        this.loadAchievements();
        
        // Cria a interface de conquistas
        this.createAchievementsWindow();
        
        // Inicia a verificação periódica de conquistas
        this.checkInterval = setInterval(() => this.checkAchievements(), 2000);
    }
    
    createAchievementsWindow() {
        // Cria a janela de conquistas
        const achievementsWindow = document.createElement('div');
        achievementsWindow.className = 'achievements-window';
        achievementsWindow.innerHTML = `
            <div class="achievements-header">
                <span>🏆 Conquistas</span>
                <button class="minimize-btn" id="minimizeAchievements">_</button>
            </div>
            <div class="achievements-content">
                <div class="achievements-tabs">
                    <button class="achievements-tab active" data-game="all">Todas</button>
                    <button class="achievements-tab" data-game="1">Snake 1</button>
                    <button class="achievements-tab" data-game="2">Snake 2</button>
                </div>
                <div class="achievements-list" id="achievementsList">
                    <!-- As conquistas serão inseridas aqui dinamicamente -->
                </div>
            </div>
        `;
        
        document.body.appendChild(achievementsWindow);
        
        // Configura os eventos
        const minimizeBtn = achievementsWindow.querySelector('#minimizeAchievements');
        const tabs = achievementsWindow.querySelectorAll('.achievements-tab');
        
        minimizeBtn.addEventListener('click', () => {
            achievementsWindow.classList.toggle('minimized');
            minimizeBtn.textContent = achievementsWindow.classList.contains('minimized') ? '□' : '_';
        });
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const gameId = tab.dataset.game;
                this.updateAchievementsList(gameId);
            });
        });
        
        // Torna a janela arrastável
        this.makeDraggable(achievementsWindow);
        
        // Adiciona estilos
        this.addAchievementsStyles();
        
        // Atualiza a lista de conquistas
        this.updateAchievementsList('all');
    }
    
    makeDraggable(element) {
        const header = element.querySelector('.achievements-header');
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
    
    updateAchievementsList(gameFilter) {
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;
        
        achievementsList.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            // Filtra as conquistas com base na aba selecionada
            let shouldShow = false;
            let isUnlocked = false;
            
            if (gameFilter === 'all') {
                shouldShow = true;
                isUnlocked = achievement.awarded.game1 || achievement.awarded.game2 || achievement.awarded.session;
            } else if (gameFilter === '1') {
                shouldShow = 'game1' in achievement.awarded;
                isUnlocked = achievement.awarded.game1;
            } else if (gameFilter === '2') {
                shouldShow = 'game2' in achievement.awarded;
                isUnlocked = achievement.awarded.game2;
            }
            
            if (shouldShow) {
                const achievementEl = document.createElement('div');
                achievementEl.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
                achievementEl.innerHTML = `
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                    </div>
                    <div class="achievement-status">${isUnlocked ? '✓' : '🔒'}</div>
                `;
                
                achievementsList.appendChild(achievementEl);
            }
        });
    }
    
    checkAchievements() {
        let newAchievements = false;
        
        // Verifica as conquistas para o jogo 1
        if (window.gameStatistics && window.gameStatistics.stats.game1) {
            const stats = window.gameStatistics.stats.game1;
            
            this.achievements.forEach(achievement => {
                if ('game1' in achievement.awarded && !achievement.awarded.game1) {
                    if (achievement.condition(stats)) {
                        achievement.awarded.game1 = true;
                        this.showAchievementNotification(achievement, 1);
                        newAchievements = true;
                    }
                }
            });
        }
        
        // Verifica as conquistas para o jogo 2
        if (window.gameStatistics && window.gameStatistics.stats.game2) {
            const stats = window.gameStatistics.stats.game2;
            
            this.achievements.forEach(achievement => {
                if ('game2' in achievement.awarded && !achievement.awarded.game2) {
                    if (achievement.condition(stats)) {
                        achievement.awarded.game2 = true;
                        this.showAchievementNotification(achievement, 2);
                        newAchievements = true;
                    }
                }
            });
        }
        
        // Verifica as conquistas para a sessão
        if (window.gameStatistics && window.gameStatistics.sessionStats.session) {
            const stats = window.gameStatistics.sessionStats.session;
            
            this.achievements.forEach(achievement => {
                if ('session' in achievement.awarded && !achievement.awarded.session) {
                    if (achievement.condition(stats)) {
                        achievement.awarded.session = true;
                        this.showAchievementNotification(achievement, 'sessão');
                        newAchievements = true;
                    }
                }
            });
        }
        
        // Se novas conquistas foram desbloqueadas, atualiza a lista e salva
        if (newAchievements) {
            const activeTab = document.querySelector('.achievements-tab.active');
            if (activeTab) {
                this.updateAchievementsList(activeTab.dataset.game);
            }
            
            this.saveAchievements();
        }
    }
    
    showAchievementNotification(achievement, gameId) {
        // Cria a notificação
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-icon">${achievement.icon}</div>
            <div class="achievement-notification-info">
                <div class="achievement-notification-title">Conquista Desbloqueada!</div>
                <div class="achievement-notification-name">${achievement.name}</div>
                <div class="achievement-notification-description">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Anima a notificação
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove a notificação após alguns segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
        
        // Notifica no chat
        if (window.snakeChat) {
            const gameText = typeof gameId === 'number' ? `Snake ${gameId}` : 'Sessão';
            window.snakeChat.addSystemMessage(`🏆 Conquista Desbloqueada para ${gameText}: ${achievement.name} - ${achievement.description}`);
        }
    }
    
    saveAchievements() {
        // Salva as conquistas no localStorage
        const saveData = {};
        
        this.achievements.forEach(achievement => {
            saveData[achievement.id] = {
                game1: achievement.awarded.game1 || false,
                game2: achievement.awarded.game2 || false,
                session: achievement.awarded.session || false
            };
        });
        
        localStorage.setItem('snakeAchievements', JSON.stringify(saveData));
    }
    
    loadAchievements() {
        // Carrega as conquistas do localStorage
        const savedData = localStorage.getItem('snakeAchievements');
        
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                
                this.achievements.forEach(achievement => {
                    if (parsedData[achievement.id]) {
                        achievement.awarded.game1 = parsedData[achievement.id].game1 || false;
                        achievement.awarded.game2 = parsedData[achievement.id].game2 || false;
                        achievement.awarded.session = parsedData[achievement.id].session || false;
                    }
                });
            } catch (error) {
                console.error('Erro ao carregar conquistas:', error);
            }
        }
    }
    
    addAchievementsStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .achievements-window {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 350px;
                background: rgba(0, 0, 0, 0.85);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: white;
                z-index: 1000;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease;
            }
            
            .achievements-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px 10px 0 0;
                cursor: grab;
            }
            
            .achievements-content {
                padding: 15px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .achievements-tabs {
                display: flex;
                gap: 5px;
                margin-bottom: 15px;
            }
            
            .achievements-tab {
                flex: 1;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                padding: 8px 5px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9em;
            }
            
            .achievements-tab:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .achievements-tab.active {
                background: #FFD700;
                color: #000;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }
            
            .achievements-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .achievement-item {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(255, 255, 255, 0.05);
                padding: 10px;
                border-radius: 5px;
                transition: all 0.3s ease;
            }
            
            .achievement-item.unlocked {
                background: rgba(76, 175, 80, 0.2);
                border-left: 3px solid #4CAF50;
            }
            
            .achievement-item.locked {
                filter: grayscale(0.8);
                opacity: 0.6;
            }
            
            .achievement-icon {
                font-size: 1.5em;
                min-width: 30px;
                text-align: center;
            }
            
            .achievement-info {
                flex: 1;
            }
            
            .achievement-name {
                font-weight: bold;
                margin-bottom: 3px;
            }
            
            .achievement-description {
                font-size: 0.8em;
                color: rgba(255, 255, 255, 0.7);
            }
            
            .achievement-status {
                font-size: 1.2em;
            }
            
            .achievements-window.minimized .achievements-content {
                display: none;
            }
            
            /* Notificações de conquistas */
            .achievement-notification {
                position: fixed;
                bottom: -100px;
                right: 20px;
                width: 300px;
                background: rgba(76, 175, 80, 0.9);
                border-radius: 10px;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                color: white;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                z-index: 2000;
                transition: transform 0.5s ease;
            }
            
            .achievement-notification.show {
                transform: translateY(-120px);
            }
            
            .achievement-notification-icon {
                font-size: 2em;
            }
            
            .achievement-notification-info {
                flex: 1;
            }
            
            .achievement-notification-title {
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .achievement-notification-name {
                font-size: 1.1em;
                margin-bottom: 3px;
            }
            
            .achievement-notification-description {
                font-size: 0.8em;
                opacity: 0.9;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
}

/**
 * Inicializa o sistema de conquistas
 */
function initializeAchievementsSystem() {
    // Cria a instância do sistema de conquistas
    window.achievementsSystem = new AchievementsSystem();
    
    console.log('Sistema de conquistas inicializado com sucesso');
}

// Inicializa o sistema após o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
    // Espera um pouco para garantir que outros elementos foram inicializados
    setTimeout(() => {
        initializeAchievementsSystem();
    }, 2200);
});