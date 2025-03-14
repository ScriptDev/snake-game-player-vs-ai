class PlayerControls {
    constructor(game, playerNumber) {
        this.game = game;
        this.playerNumber = playerNumber;
        this.isActive = false;
        this.keyMap = {
            player1: {
                up: "ArrowUp",
                down: "ArrowDown",
                left: "ArrowLeft",
                right: "ArrowRight"
            },
            player2: {
                up: "w",
                down: "s",
                left: "a",
                right: "d"
            }
        };
        
        // Define qual conjunto de teclas usar
        this.keys = this.keyMap[`player${playerNumber}`];
        
        // Referência para o método de manipulação de teclas
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        document.addEventListener('keydown', this.handleKeyDown);
        
        // Notifica o chat
        if (window.snakeChat) {
            window.snakeChat.addSystemMessage(`Controle manual da Snake ${this.playerNumber} ativado! 🎮`);
        }
        
        console.log(`Controles do jogador ${this.playerNumber} ativados`);
    }
    
    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Notifica o chat
        if (window.snakeChat) {
            window.snakeChat.addSystemMessage(`Controle manual da Snake ${this.playerNumber} desativado! 🤖`);
        }
        
        console.log(`Controles do jogador ${this.playerNumber} desativados`);
    }
    
    handleKeyDown(event) {
        if (!this.isActive || !this.game.gameLoop) return;
        
        const key = event.key;
        
        if (key === this.keys.up && this.game.snake.dy !== 1) {
            this.game.changeDirection('up');
        } else if (key === this.keys.down && this.game.snake.dy !== -1) {
            this.game.changeDirection('down');
        } else if (key === this.keys.left && this.game.snake.dx !== 1) {
            this.game.changeDirection('left');
        } else if (key === this.keys.right && this.game.snake.dx !== -1) {
            this.game.changeDirection('right');
        }
    }
    
    // Retorna informações sobre os controles para exibir na interface
    getControlsInfo() {
        return {
            player: this.playerNumber,
            controls: this.keys,
            active: this.isActive
        };
    }
}
