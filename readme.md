# Sistema de Jogador Humano vs IA para Snake Game

## Visão Geral

Esta implementação adiciona funcionalidades completas para permitir que jogadores humanos joguem contra inteligências artificiais no jogo Snake. O sistema suporta controle manual das cobras, diferentes modos de jogo, rastreamento de estatísticas, conquistas desbloqueáveis, e ajustes de dificuldade.

## Funcionalidades Principais

### 1. Controles do Jogador
- **Jogador 1**: Usa as teclas de seta (↑, ↓, ←, →) para controlar a cobra azul
- **Jogador 2**: Usa as teclas WASD (W, A, S, D) para controlar a cobra verde
- Alternância rápida entre modo jogador e IA com botões dedicados
- Indicadores visuais mostrando o modo atual (Manual, Jogador, IA)

### 2. Diferentes Modos de Jogo
- **Modo Padrão**: Cada cobra pode ser controlada independentemente
- **Modo Versus**: Competição entre jogador humano e IA com sistema de pontuação
- **Modo Torneio**: Competição automática entre IAs com várias rodadas

### 3. Sistema de Dificuldade Ajustável
- Quatro níveis de dificuldade: Fácil, Médio, Difícil e Especialista
- Ajusta velocidade da cobra, tempo de reação da IA, precisão e comportamento dos inimigos
- Interface para alterar a dificuldade durante o jogo

### 4. Sistema de Estatísticas
- Rastreamento detalhado do desempenho para cada cobra e para a sessão
- Métricas como comida coletada, pontuação total, tamanho máximo, nível máximo
- Tempo jogado como humano vs tempo observando a IA

### 5. Sistema de Conquistas
- 17 conquistas desbloqueáveis baseadas em diferentes aspectos do jogo
- Notificações quando uma conquista é desbloqueada
- Conquistas armazenadas localmente para persistir entre sessões

### 6. Sistema de Tutorial
- Tutorial passo a passo para novos jogadores
- Destaque visual dos elementos importantes da interface
- Explicações detalhadas dos controles e mecânicas

## Como Utilizar

### Iniciando o Jogo
1. Clique no botão "Iniciar Jogos" para começar
2. Escolha como controlar cada cobra:
   - Clique no botão "Jogador 1/2" ou no ícone 👤 para controle manual
   - Clique no botão "IA 1/2" ou no ícone 🤖 para controle por IA

### Controles do Teclado
- **Cobra 1 (Azul)**: 
  - ↑: Mover para cima
  - ↓: Mover para baixo
  - ←: Mover para esquerda
  - →: Mover para direita
- **Cobra 2 (Verde)**:
  - W: Mover para cima
  - S: Mover para baixo
  - A: Mover para esquerda
  - D: Mover para direita

### Alterando a Dificuldade
1. Localize o painel de Dificuldade
2. Escolha entre Fácil, Médio, Difícil ou Especialista
3. A mudança é aplicada imediatamente

### Modos de Jogo
1. No painel de controles, encontre a seção "Modos de Jogo"
2. Escolha entre Padrão, Versus ou Torneio
3. Cada modo tem suas próprias regras e objetivos

## Elementos do Jogo

- **🔵/🟢 Cobras**: Seu personagem, controlado por você ou pela IA
- **💎 Comida**: Colete para crescer e ganhar pontos
- **🧱 Muro**: Obstáculo que causa Game Over se colidir
- **🌳 Árvore**: Outro tipo de obstáculo a ser evitado
- **💧 Água**: Dificulta o movimento em algumas áreas
- **🦠 Parasita**: Inimigo que persegue sua cobra e pode causar danos
- **🌀 Túnel**: Portal que teleporta para outro local

## Dicas e Estratégias

1. **Modo Humano vs IA**:
   - Observe o comportamento da IA para aprender padrões de movimento eficientes
   - A IA é excelente em encontrar o caminho mais curto para a comida, mas pode ficar presa em laços

2. **Evitando Obstáculos**:
   - Planeje seu caminho com antecedência, especialmente em níveis de dificuldade mais altos
   - Mantenha espaço suficiente para manobrar quando a cobra ficar mais longa

3. **Parasitas**:
   - Os parasitas perseguem ativamente sua cobra - mude rapidamente de direção para evitá-los
   - Em níveis de dificuldade mais altos, os parasitas se movem mais rápido

4. **Modo Versus**:
   - Foque em coletar comida rapidamente para ganhar vantagem inicial
   - Observe o comportamento da IA oponente para prever seus movimentos

## Funcionalidades Avançadas

### Sistema de Estatísticas
- Acesse estatísticas detalhadas no painel dedicado
- Compare seu desempenho entre diferentes cobras
- Veja métricas como tempo de jogo, comidas coletadas e pontuação total

### Conquistas
- Desbloqueie conquistas baseadas em diferentes aspectos do jogo
- Cada conquista tem requisitos específicos - experimente diferentes estilos de jogo
- Conquistas são armazenadas localmente e persistem entre sessões

### God AI
- Interaja com a God AI para adicionar desafios ou obter ajuda
- A God AI pode colocar obstáculos, criar labirintos ou ajudar as cobras
- Experimente diferentes comandos para ver como a God AI responde

## Solução de Problemas

- **Problema**: Os controles do jogador não respondem
  - **Solução**: Verifique se o modo jogador está ativado (indicador deve mostrar "Modo: Jogador")
  - **Solução**: Clique no botão "Jogador" ou no ícone 👤 para ativar o controle manual

- **Problema**: A IA não se move ou toma decisões ruins
  - **Solução**: Ajuste o nível de dificuldade para influenciar o comportamento da IA
  - **Solução**: Reinicie o jogo se a IA ficar presa em um loop

- **Problema**: Janelas de interface sobrepostas
  - **Solução**: Arraste as janelas usando suas barras de título para reorganizá-las
  - **Solução**: Minimize janelas menos utilizadas clicando no botão "_"
