// Configurações do seu repositório fixadas
const REPO_OWNER = 'AngeloGabrielAlbonetti'; 
const REPO_NAME = 'java';
const DEFAULT_FOLDER = 'Java_1'; 

const output = document.getElementById('output');
const input = document.getElementById('command-input');

// 1. FUNÇÕES DE SERVIÇO (CONEXÃO COM O GITHUB)

/**
 * Coleta todos os arquivos da pasta Java_1 utilizando a API pública do GitHub
 */
async function fetchExercisesList() {
    const url = `https://github.com{REPO_OWNER}/${REPO_NAME}/contents/${DEFAULT_FOLDER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Não foi possível acessar a pasta do repositório.');
    return await response.json();
}

/**
 * Obtém e decodifica em texto puro o código de um arquivo específico
 */
async function fetchFileContent(fileName) {
    const fileUrl = `https://github.com{REPO_OWNER}/${REPO_NAME}/contents/${DEFAULT_FOLDER}/${fileName}`;
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Arquivo não encontrado.');
    
    const fileData = await response.json();
    if (fileData.type === 'dir') {
        throw new Error(`'${fileName}' é um diretório. Carregue apenas arquivos.`);
    }

    // O GitHub retorna strings em Base64. Esta função decodifica aceitando caracteres especiais
    return decodeURIComponent(escape(atob(fileData.content)));
}


// 2. LÓGICA DE CONTROLE DO TERMINAL

// Gerenciador do evento da tecla Enter no input do terminal
input.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        const cmd = input.value.trim();
        if (!cmd) return;
        
        output.innerHTML += `<div><span class="prompt">angelo@poo-java:~$</span> ${escapeHtml(cmd)}</div>`;
        await processCommand(cmd);
        input.value = '';
        output.scrollTop = output.scrollHeight;
    }
});

// Processa o comando digitado no terminal
async function processCommand(cmd) {
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase(); // Correção da captura de string limpa
    const arg = parts.slice(1).join(' ');

    if (command === 'help') {
        output.innerHTML += `<div>Comandos do Terminal:<br>  <span class="file-link">list</span>          - Lista os exercícios em '${DEFAULT_FOLDER}'<br>  <span class="file-link">read [arquivo]</span> - Abre o código de um arquivo Java<br>  <span class="file-link">clear</span>         - Limpa o terminal</div>`;
    } 
    else if (command === 'clear') {
        output.innerHTML = '';
    } 
    else if (command === 'list') {
        output.innerHTML += `<div class="info">Buscando exercícios na pasta '${DEFAULT_FOLDER}'...</div>`;
        try {
            const files = await fetchExercisesList();
            const exercicios = files.filter(f => f.name.endsWith('.java') || f.type === 'dir');

            if (exercicios.length === 0) {
                output.innerHTML += `<div>Nenhum exercício encontrado em '${DEFAULT_FOLDER}'.</div>`;
                return;
            }

            let listHtml = `<div class="success">Exercícios localizados:</div>`;
            exercicios.forEach(f => {
                const icon = f.type === 'dir' ? '📁' : '📄';
                // Adiciona gatilho para carregar no clique direto sobre o nome do arquivo
                listHtml += `  ${icon} <span class="file-link" onclick="executeRead('${f.name}')">${f.name}</span><br>`;
            });
            output.innerHTML += listHtml;
        } catch (error) {
            output.innerHTML += `<div class="error">Erro: ${error.message}</div>`;
        }
    } 
    else if (command === 'read') {
        if (!arg) {
            output.innerHTML += `<div class="error">Erro: indique o nome. Ex: read Exercicio.java</div>`;
            return;
        }
        await handleFileRead(arg);
    } 
    else {
        output.innerHTML += `<div class="error">Comando inválido. Digite 'list' para ver as opções.</div>`;
    }
}

// Controla a exibição estruturada do código retornado pela API
async function handleFileRead(fileName) {
    output.innerHTML += `<div class="info">Lendo arquivo: ${fileName}...</div>`;
    try {
        const decodedCode = await fetchFileContent(fileName);
        output.innerHTML += `<div><span class="success">--- Exibindo: ${fileName} ---</span></div>`;
        output.innerHTML += `<pre class="code-box">${escapeHtml(decodedCode)}</pre>`;
    } catch (error) {
        output.innerHTML += `<div class="error">Erro: ${error.message}</div>`;
    }
}

// Função para cliques nas strings geradas dinamicamente
function executeRead(name) {
    output.innerHTML += `<div><span class="prompt">angelo@poo-java:~$</span> read ${name}</div>`;
    handleFileRead(name);
}

// Vincula a função de clique na janela global (window) por segurança extra
window.executeRead = executeRead;

// Evita que as tags internas dos códigos Java quebrem a árvore DOM do HTML
function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
