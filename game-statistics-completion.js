// Funções adicionais para o sistema de estatísticas

/**
 * Funções de integração para o sistema de estatísticas
 * Estas funções melhoram o rastreamento e a visualização das estatísticas
 */

// Função para gerar relatório de estatísticas
function generateStatsReport() {
    if (!window.gameStatistics) return null;
    
    const report = {
        game1: { ...window.gameStatistics.stats.game1 },
        game2: { ...window.gameStatistics.stats.game2 },
        session: { ...window.gameStatistics.sessionStats.session }
    };
    
    // Calcular métricas adicionais
    if (report.game1.timeAlive > 0) {
        report.game1.foodPerMinute = (report.game1.foodCollected / (report.game1.timeAlive / 60)).toFixed(2);
        report.game1.scorePerMinute = (report.game1.totalScore / (report.game1.timeAlive / 60)).toFixed(2);
    }
    
    if (report.game2.timeAlive > 0) {
        report.game2.foodPerMinute = (report.game2.foodCollected / (report.game2.timeAlive / 60)).toFixed(2);
        report.game2.scorePerMinute = (report.game2.totalScore / (report.game2.timeAlive / 60)).toFixed(2);
    }
    
    // Determinar qual jogo teve melhor desempenho
    const performance = {
        bestScore: report.game1.totalScore > report.game2.totalScore ? 'Snake 1' : 'Snake 2',
        bestLength: report.game1.maxLength > report.game2.maxLength ? 'Snake 1' : 'Snake 2',
        bestLevel: report.game1.maxLevel > report.game2.maxLevel ? 'Snake 1' : 'Snake 2',
        mostFood: report.game1.foodCollected > report.game2.foodCollected ? 'Snake 1' : 'Snake 2'
    };
    
    report.performance = performance;
    return report;
}

// Função para exibir relatório detalhado
function showDetailedStatsReport() {
    const report = generateStatsReport();
    if (!report) return;
    
    // Cria o modal de relatório
    const reportModal = document.createElement('div');
    reportModal.className = 'stats-report-modal';
    reportModal.innerHTML = `
        <div class="stats-report-content">
            <div class="stats-report-header">
                <h2>Relatório de Desempenho</h2>
                <button class="close-btn">×</button>
            </div>
            <div class="stats-report-body">
                <div class="stats-report-summary">
                    <h3>Resumo da Sessão</h3>
                    <div class="stats-summary-row">
                        <span>Tempo Total de Jogo:</span>
                        <span>${formatTime(report.session.timeAlive)}</span>
                    </div>
                    <div class="stats-summary-row">
                        <span>Total de Comida Coletada:</span>
                        <span>${report.session.foodCollected}</span>
                    </div>
                    <div class="stats-summary-row">
                        <span>Pontuação Total:</span>
                        <span>${report.session.totalScore}</span>
                    </div>
                    <div class="stats-summary-row">
                        <span>Mortes Totais:</span>
                        <span>${report.session.deaths}</span>
                    </div>
                </div>
                
                <div class="stats-report-comparison">
                    <h3>Comparação</h3>
                    <div class="comparison-table">
                        <div class="comparison-header">
                            <div class="comparison-cell">Métrica</div>
                            <div class="comparison-cell">Snake 1</div>
                            <div class="comparison-cell">Snake 2</div>
                        </div>
                        <div class="comparison-row">
                            <div class="comparison-cell">Pontuação</div>
                            <div class="comparison-cell ${report.performance.bestScore === 'Snake 1' ? 'best' : ''}">${report.game1.totalScore}</div>
                            <div class="comparison-cell ${report.performance.bestScore === 'Snake 2' ? 'best' : ''}">${report.game2.totalScore}</div>
                        </div>
                        <div class="comparison-row">
                            <div class="comparison-cell">Tamanho Máximo</div>
                            <div class="comparison-cell ${report.performance.bestLength === 'Snake 1' ? 'best' : ''}">${report.game1.maxLength}</div>
                            <div class="comparison-cell ${report.performance.bestLength === 'Snake 2' ? 'best' : ''}">${report.game2.maxLength}</div>
                        </div>
                        <div class="comparison-row">
                            <div class="comparison-cell">Nível Máximo</div>
                            <div class="comparison-cell ${report.performance.bestLevel === 'Snake 1' ? 'best' : ''}">${report.game1.maxLevel}</div>
                            <div class="comparison-cell ${report.performance.bestLevel === 'Snake 2' ? 'best' : ''}">${report.game2.maxLevel}</div>
                        </div>
                        <div class="comparison-row">
                            <div class="comparison-cell">Comida Coletada</div>
                            <div class="comparison-cell ${report.performance.mostFood === 'Snake 1' ? 'best' : ''}">${report.game1.foodCollected}</div>
                            <div class="comparison-cell ${report.performance.mostFood === 'Snake 2' ? 'best' : ''}">${report.game2.foodCollected}</div>
                        </div>
                        <div class="comparison-row">
                            <div class="comparison-cell">Tempo Vivo</div>
                            <div class="comparison-cell">${formatTime(report.game1.timeAlive)}</div>
                            <div class="comparison-cell">${formatTime(report.game2.timeAlive)}</div>
                        </div>
                        <div class="comparison-row">
                            <div class="comparison-cell">Comida/Minuto</div>
                            <div class="comparison-cell">${report.game1.foodPerMinute || '0'}</div>
                            <div class="comparison-cell">${report.game2.foodPerMinute || '0'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="stats-report-conclusion">
                    <h3>Conclusão</h3>
                    <p>${generateConclusion(report)}</p>
                </div>
                
                <button class="stats-report-btn">Fechar Relatório</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(reportModal);
    
    // Adiciona estilos
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .stats-report-modal {
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
        }
        
        .stats-report-content {
            background: rgba(0, 0, 0, 0.9);
            width: 80%;
            max-width: 800px;
            max-height: 90vh;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        .stats-report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stats-report-header h2 {
            margin: 0;
            color: #4CAF50;
        }
        
        .stats-report-body {
            padding: 20px;
            max-height: calc(90vh - 70px);
            overflow-y: auto;
            color: white;
        }
        
        .stats-report-summary, .stats-report-comparison, .stats-report-conclusion {
            margin-bottom: 20px;
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 5px;
        }
        
        .stats-summary-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
        }
        
        .comparison-table {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 5px;
        }
        
        .comparison-header {
            display: contents;
            font-weight: bold;
        }
        
        .comparison-header .comparison-cell {
            background: rgba(255, 255, 255, 0.1);
            padding: 8px;
            border-radius: 3px;
        }
        
        .comparison-row {
            display: contents;
        }
        
        .comparison-cell {
            padding: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }
        
        .comparison-cell.best {
            background: rgba(76, 175, 80, 0.2);
            font-weight: bold;
            color: #4CAF50;
        }
        
        .stats-report-btn {
            display: block;
            margin: 20px auto 0;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .stats-report-btn:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(styleElement);
    
    // Configura os eventos
    const closeBtn = reportModal.querySelector('.close-btn');
    const reportBtn = reportModal.querySelector('.stats-report-btn');
    
    closeBtn.addEventListener('click', () => {
        reportModal.remove();
        styleElement.remove();
    });
    
    reportBtn.addEventListener('click', () => {
        reportModal.remove();
        styleElement.remove();
    });
}

// Função auxiliar para formatar o tempo
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
}

// Função para gerar conclusão baseada nas estatísticas
function generateConclusion(report) {
    // Determina qual cobra teve melhor desempenho geral
    let bestSnake;
    let bestScore = 0;
    
    // Pontuação ponderada para determinar melhor desempenho
    const score1 = report.game1.totalScore * 0.4 + 
                  report.game1.maxLength * 0.2 + 
                  report.game1.maxLevel * 0.2 + 
                  report.game1.foodCollected * 0.2;
                  
    const score2 = report.game2.totalScore * 0.4 + 
                  report.game2.maxLength * 0.2 + 
                  report.game2.maxLevel * 0.2 + 
                  report.game2.foodCollected * 0.2;
    
    if (score1 > score2) {
        bestSnake = 'Snake 1 (Azul)';
        bestScore = score1;
    } else if (score2 > score1) {
        bestSnake = 'Snake 2 (Verde)';
        bestScore = score2;
    } else {
        // Empate
        return "Ambas as cobras tiveram desempenho similar nesta sessão. Parabéns por um jogo equilibrado!";
    }
    
    // Gera uma conclusão personalizada
    if (bestScore > 1000) {
        return `${bestSnake} teve um desempenho excepcional nesta sessão! Continue com o excelente trabalho!`;
    } else if (bestScore > 500) {
        return `${bestSnake} teve o melhor desempenho geral nesta sessão. Bom trabalho!`;
    } else {
        return `${bestSnake} teve um desempenho ligeiramente melhor nesta sessão. Continue praticando!`;
    }
}

// Adiciona botão para exibir relatório de estatísticas
function addStatsReportButton() {
    // Verifica se o botão já existe
    if (document.getElementById('statsReportButton')) return;
    
    const statsWindow = document.querySelector('.stats-window');
    if (!statsWindow) return;
    
    const reportButton = document.createElement('button');
    reportButton.id = 'statsReportButton';
    reportButton.className = 'stats-report-button';
    reportButton.textContent = 'Ver Relatório Completo';
    reportButton.title = 'Exibe um relatório detalhado de estatísticas';
    
    // Adiciona o botão após o conteúdo da janela de estatísticas
    const statsContent = statsWindow.querySelector('.stats-content');
    statsContent.appendChild(reportButton);
    
    // Adiciona estilo para o botão
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .stats-report-button {
            width: 100%;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 0;
            border-radius: 5px;
            margin-top: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .stats-report-button:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(styleElement);
    
    // Adiciona evento
    reportButton.addEventListener('click', () => {
        showDetailedStatsReport();
    });
}

// Inicializa o botão de relatório após um atraso
setTimeout(addStatsReportButton, 3000);
