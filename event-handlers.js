// Adicione estes observadores para atualizar os indicadores de modo quando o estado do jogo mudar
// Inclua no final do arquivo script.js

// Função para observar mudanças no controlMode
function observeControlModeChanges() {
    // Para o jogo 1
    if (window.game1) {
        const originalToggleAI = window.game1.toggleAI;
        window.game1.toggleAI = function() {
            originalToggleAI.call(this);
            updateModeIndicator(1, this.controlMode);
        };
        
        const originalTogglePlayerControl = window.game1.togglePlayerControl;
        window.game1.togglePlayerControl = function() {
            originalTogglePlayerControl.call(this);
            updateModeIndicator(1, this.controlMode);
        };
    }
    
    // Para o jogo 2
    if (window.game2) {
        const originalToggleAI2 = window.game2.toggleAI;
        window.game2.toggleAI = function() {
            originalToggleAI2.call(this);
            updateModeIndicator(2, this.controlMode);
        };
        
        const originalTogglePlayerControl2 = window.game2.togglePlayerControl;
        window.game2.togglePlayerControl = function() {
            originalTogglePlayerControl2.call(this);
            updateModeIndicator(2, this.controlMode);
        };
    }
}

// Melhorias na experiência do jogador
function enhancePlayerExperience() {
    // Adiciona dicas periódicas sobre controles
    setInterval(() => {
        if (window.snakeChat && (window.game1.gameLoop || window.game2.gameLoop)) {
            const tips = [
                "Dica: Pressione as setas para controlar a Snake 1 no modo jogador 🎮",
                "Dica: Use WASD para controlar a Snake 2 no modo jogador 🎮",
                "Dica: Alterne entre os modos jogador e IA para uma experiência diferente! 🔄",
                "Dica: A God AI pode ajudar ou dificultar seu jogo. Converse com ela! 🎭",
                "Dica: Cuidado com os parasitas! Eles perseguem sua cobra e causam danos 🦠",
                "Dica: Os túneis teleportam sua cobra para outra área do jogo 🌀",
                "Dica: Colete comida para crescer e ganhar pontos 💎",
                "Dica: Evite colidir com os muros, árvores e com seu próprio corpo! 💥"
            ];
            
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            window.snakeChat.addSystemMessage(randomTip);
        }
    }, 45000); // A cada 45 segundos
    
    // Efeito visual quando o jogador muda o modo de controle
    function addModeChangeEffect(gameNumber) {
        const gameContainer = document.getElementById(`game${gameNumber}`);
        if (!gameContainer) return;
        
        const effect = document.createElement('div');
        effect.className = 'mode-change-effect';
        gameContainer.appendChild(effect);
        
        // Anima e remove o efeito
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
    
    // Adiciona os event listeners para keydown para melhorar a resposta do jogador
    document.addEventListener('keydown', (e) => {
        // Se o jogo 1 estiver no modo jogador, exibe feedback visual para as teclas de seta
        if (window.game1 && window.game1.controlMode === 'player') {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                const gameContainer = document.getElementById('game1');
                gameContainer.classList.add('key-pressed');
                setTimeout(() => {
                    gameContainer.classList.remove('key-pressed');
                }, 100);
            }
        }
        
        // Se o jogo 2 estiver no modo jogador, exibe feedback visual para as teclas WASD
        if (window.game2 && window.game2.controlMode === 'player') {
            if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
                const gameContainer = document.getElementById('game2');
                gameContainer.classList.add('key-pressed');
                setTimeout(() => {
                    gameContainer.classList.remove('key-pressed');
                }, 100);
            }
        }
    });
}

// Chame essas funções após a inicialização dos jogos
document.addEventListener('DOMContentLoaded', () => {
    // Outras inicializações...
    
    // Aguarda um pouco para garantir que os jogos estejam inicializados
    setTimeout(() => {
        observeControlModeChanges();
        enhancePlayerExperience();
    }, 500);
});
