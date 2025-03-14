/**
 * Sistema de Tutorial
 * Guia o jogador através dos controles e mecânicas do jogo
 */
class TutorialSystem {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.tutorialSteps = [
            {
                title: "Bem-vindo ao Snake Game!",
                content: "Este tutorial irá guiá-lo através dos controles e mecânicas básicas do jogo.",
                target: null,
                position: "center"
            },
            {
                title: "Controles do Jogador",
                content: "Clique em 'Jogador 1' para controlar a cobra azul com as setas do teclado (↑, ↓, ←, →).",
                target: "#playerBtn1",
                position: "bottom"
            },
            {
                title: "Controles do Jogador 2",
                content: "Clique em 'Jogador 2' para controlar a cobra verde com as teclas WASD (W=cima, A=esquerda, S=baixo, D=direita).",
                target: "#playerBtn2",
                position: "bottom"
            },
            {
                title: "Inteligência Artificial",
                content: "Clique em 'IA 1' ou 'IA 2' para ativar a IA que controlará a cobra automaticamente.",
                target: "#aiBtn1",
                position: "bottom"
            },
            {
                title: "Iniciar os Jogos",
                content: "Clique em 'Iniciar Jogos' para começar. Ambas as cobras podem ser controladas ao mesmo tempo.",
                target: "#startBothBtn",
                position: "bottom"
            },
            {
                title: "Objetivo do Jogo",
                content: "Colete comida (pontos brilhantes) para crescer e ganhar pontos. Evite colidir com obstáculos e com seu próprio corpo!",
                target: "#game1",
                position: "right"
            },
            {
                title: "God AI",
                content: "A God AI pode ajudar ou dificultar seu jogo. Ative-a e converse pedindo para colocar obstáculos ou ajudar as cobras.",
                target: "#godAiWindow",
                position: "left"
            },
            {
                title: "Modos de Jogo",
                content: "Experimente os diferentes modos de jogo: 'Padrão' para jogo normal, 'Versus' para competir contra a IA, ou 'Torneio' para uma competição entre IAs.",
                target: ".mode-buttons",
                position: "top"
            },
            {
                title: "Chat das Cobras",
                content: "Veja as mensagens e interações entre as cobras no chat. As cobras têm personalidades distintas!",
                target: "#chatWindow",
                position: "left"
            },
            {
                title: "Ferramentas de Obstáculos",
                content: "Use estas ferramentas para adicionar obstáculos (muros, árvores), água, parasitas e túneis ao jogo.",
                target: "#tools1",
                position: "right"
            },
            {
                title: "Você está pronto!",
                content: "Agora você conhece o básico para jogar. Divirta-se e boa sorte!",
                target: null,
                position: "center"
            }
        ];
        
        this.createTutorialElements();
    }
    
    createTutorialElements() {
        // Cria o overlay de tutorial
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        
        // Cria o modal de tutorial
        this.modal = document.createElement('div');
        this.modal.className = 'tutorial-modal';
        this.modal.innerHTML = `
            <div class="tutorial-header">
                <span class="tutorial-title">Bem-vindo ao Tutorial</span>
                <button class="tutorial-close-btn">×</button>
            </div>
            <div class="tutorial-content">
                <p class="tutorial-text">Vamos aprender como jogar!</p>
            </div>
            <div class="tutorial-navigation">
                <button class="tutorial-prev-btn" disabled>Anterior</button>
                <div class="tutorial-progress">
                    <span class="tutorial-step">1</span>/<span class="tutorial-total">11</span>
                </div>
                <button class="tutorial-next-btn">Próximo</button>
            </div>
        `;
        
        // Cria o destaque (highlight)
        this.highlight = document.createElement('div');
        this.highlight.className = 'tutorial-highlight';
        
        // Adiciona os elementos ao DOM, mas ocultos inicialmente
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);
        document.body.appendChild(this.highlight);
        
        // Configura os event listeners
        const closeBtn = this.modal.querySelector('.tutorial-close-btn');
        const prevBtn = this.modal.querySelector('.tutorial-prev-btn');
        const nextBtn = this.modal.querySelector('.tutorial-next-btn');
        
        closeBtn.addEventListener('click', () => this.endTutorial());
        prevBtn.addEventListener('click', () => this.prevStep());
        nextBtn.addEventListener('click', () => this.nextStep());
        
        // Esconde os elementos inicialmente
        this.overlay.style.display = 'none';
        this.modal.style.display = 'none';
        this.highlight.style.display = 'none';
    }
    
    startTutorial() {
        // Exibe os elementos de tutorial
        this.overlay.style.display = 'block';
        this.modal.style.display = 'block';
        
        // Define o estado inicial
        this.currentStep = 0;
        this.isActive = true;
        
        // Atualiza o conteúdo do tutorial
        this.updateTutorialContent();
        
        // Adiciona uma classe ao body para evitar interações indesejadas
        document.body.classList.add('tutorial-active');
        
        // Notifica no chat
        if (window.snakeChat) {
            window.snakeChat.addSystemMessage("Tutorial iniciado! Siga as instruções para aprender a jogar. 🎮");
        }
    }
    
    endTutorial() {
        // Esconde os elementos de tutorial
        this.overlay.style.display = 'none';
        this.modal.style.display = 'none';
        this.highlight.style.display = 'none';
        
        // Atualiza o estado
        this.isActive = false;
        
        // Remove a classe do body
        document.body.classList.remove('tutorial-active');
        
        // Notifica no chat
        if (window.snakeChat) {
            window.snakeChat.addSystemMessage("Tutorial encerrado! Bom jogo! 🎮");
        }
    }
    
    nextStep() {
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.currentStep++;
            this.updateTutorialContent();
        } else {
            this.endTutorial();
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateTutorialContent();
        }
    }
    
    updateTutorialContent() {
        const step = this.tutorialSteps[this.currentStep];
        
        // Atualiza o conteúdo do modal
        this.modal.querySelector('.tutorial-title').textContent = step.title;
        this.modal.querySelector('.tutorial-text').textContent = step.content;
        
        // Atualiza os números de etapa
        this.modal.querySelector('.tutorial-step').textContent = this.currentStep + 1;
        this.modal.querySelector('.tutorial-total').textContent = this.tutorialSteps.length;
        
        // Atualiza os botões de navegação
        const prevBtn = this.modal.querySelector('.tutorial-prev-btn');
        const nextBtn = this.modal.querySelector('.tutorial-next-btn');
        
        prevBtn.disabled = this.currentStep === 0;
        nextBtn.textContent = this.currentStep === this.tutorialSteps.length - 1 ? 'Concluir' : 'Próximo';
        
        // Destaca o elemento alvo, se houver
        if (step.target) {
            const targetElement = document.querySelector(step.target);
            if (targetElement) {
                // Exibe o destaque
                this.highlight.style.display = 'block';
                
                // Posiciona o destaque no elemento
                const rect = targetElement.getBoundingClientRect();
                this.highlight.style.top = rect.top + window.scrollY + 'px';
                this.highlight.style.left = rect.left + window.scrollX + 'px';
                this.highlight.style.width = rect.width + 'px';
                this.highlight.style.height = rect.height + 'px';
                
                // Posiciona o modal de acordo com a posição especificada
                this.positionModal(targetElement, step.position);
            }
        } else {
            // Esconde o destaque para etapas sem elemento alvo
            this.highlight.style.display = 'none';
            
            // Centraliza o modal
            this.modal.style.top = '50%';
            this.modal.style.left = '50%';
            this.modal.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    positionModal(targetElement, position) {
        const targetRect = targetElement.getBoundingClientRect();
        const modalRect = this.modal.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = targetRect.top - modalRect.height - 10 + window.scrollY;
                left = targetRect.left + (targetRect.width / 2) - (modalRect.width / 2) + window.scrollX;
                break;
            case 'bottom':
                top = targetRect.bottom + 10 + window.scrollY;
                left = targetRect.left + (targetRect.width / 2) - (modalRect.width / 2) + window.scrollX;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (modalRect.height / 2) + window.scrollY;
                left = targetRect.left - modalRect.width - 10 + window.scrollX;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - (modalRect.height / 2) + window.scrollY;
                left = targetRect.right + 10 + window.scrollX;
                break;
            default: // center
                top = '50%';
                left = '50%';
                this.modal.style.transform = 'translate(-50%, -50%)';
                return;
        }
        
        // Garante que o modal não ultrapasse os limites da janela
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (left < 20) left = 20;
        if (left + modalRect.width > viewportWidth - 20) left = viewportWidth - modalRect.width - 20;
        if (top < 20) top = 20;
        if (top + modalRect.height > viewportHeight - 20) top = viewportHeight - modalRect.height - 20;
        
        // Define a posição
        this.modal.style.top = top + 'px';
        this.modal.style.left = left + 'px';
        this.modal.style.transform = 'none';
    }
}

/**
 * Adiciona os estilos para o sistema de tutorial
 */
function addTutorialStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .tutorial-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 2000;
        }
        
        .tutorial-modal {
            position: fixed;
            width: 350px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #4CAF50;
            border-radius: 10px;
            padding: 0;
            color: white;
            z-index: 2002;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
        }
        
        .tutorial-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: rgba(76, 175, 80, 0.2);
            border-bottom: 1px solid rgba(76, 175, 80, 0.5);
            border-radius: 8px 8px 0 0;
        }
        
        .tutorial-title {
            font-weight: bold;
            color: #4CAF50;
        }
        
        .tutorial-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.5em;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0 5px;
        }
        
        .tutorial-close-btn:hover {
            color: #F44336;
        }
        
        .tutorial-content {
            padding: 15px;
            min-height: 80px;
        }
        
        .tutorial-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.3);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0 0 8px 8px;
        }
        
        .tutorial-prev-btn, .tutorial-next-btn {
            background: rgba(76, 175, 80, 0.3);
            border: 1px solid rgba(76, 175, 80, 0.5);
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .tutorial-prev-btn:hover, .tutorial-next-btn:hover {
            background: rgba(76, 175, 80, 0.5);
        }
        
        .tutorial-prev-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .tutorial-progress {
            background: rgba(0, 0, 0, 0.3);
            padding: 5px 10px;
            border-radius: 10px;
            font-size: 0.9em;
        }
        
        .tutorial-highlight {
            position: absolute;
            border: 3px dashed #FFD700;
            border-radius: 5px;
            background: rgba(255, 215, 0, 0.1);
            z-index: 2001;
            animation: pulse 2s infinite;
            pointer-events: none;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.5); }
            70% { box-shadow: 0 0 0 15px rgba(255, 215, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }
        
        /* Botão para iniciar o tutorial */
        .tutorial-button {
            position: fixed;
            bottom: 20px;
            left: 70px; /* Ao lado do botão de ajuda */
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(76, 175, 80, 0.8);
            color: white;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .tutorial-button:hover {
            background: rgba(76, 175, 80, 1);
            transform: scale(1.1);
        }
        
        /* Classe para aplicar ao body durante o tutorial */
        body.tutorial-active {
            overflow: hidden;
        }
    `;
    
    document.head.appendChild(styleElement);
}

/**
 * Inicializa o sistema de tutorial
 */
function initializeTutorial() {
    // Adiciona os estilos
    addTutorialStyles();
    
    // Cria a instância do tutorial
    window.tutorialSystem = new TutorialSystem();
    
    // Adiciona o botão para iniciar o tutorial
    const tutorialButton = document.createElement('button');
    tutorialButton.className = 'tutorial-button';
    tutorialButton.innerHTML = '▶';
    tutorialButton.title = 'Iniciar Tutorial';
    
    document.body.appendChild(tutorialButton);
    
    // Configura o event listener
    tutorialButton.addEventListener('click', () => {
        if (window.tutorialSystem) {
            window.tutorialSystem.startTutorial();
        }
    });
    
    console.log('Sistema de tutorial inicializado com sucesso');
}

// Inicializa o tutorial após o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
    // Espera um pouco para garantir que outros elementos foram inicializados
    setTimeout(() => {
        initializeTutorial();
    }, 1500);
});