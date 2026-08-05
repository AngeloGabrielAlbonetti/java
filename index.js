    const REPO_OWNER = 'AngeloGabrielAlbonetti'; 
    const REPO_NAME = 'java';
    const DEFAULT_FOLDER = 'Java_1'; 

    const output = document.getElementById('output');
    const input = document.getElementById('command-input');
    const terminal = document.getElementById('terminal');

    input.addEventListener('keydown', async function(event) {
        if (event.key === 'Enter') {
            const cmd = input.value.trim();
            output.innerHTML += `<div><span class="prompt">angelo@poo-java:~$</span> ${escapeHtml(cmd)}</div>`;
            await processCommand(cmd);
            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });

    async function processCommand(cmd) {
        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');

        if (command === 'help') {
            output.innerHTML += `<div>Comandos do Terminal:<br>  <span class="file-link">list</span>          - Lista os arquivos de exercícios dentro de '${DEFAULT_FOLDER}'<br>  <span class="file-link">read [arquivo]</span> - Carrega e exibe o código do arquivo Java<br>  <span class="file-link">clear</span>         - Limpa a tela do terminal</div>`;
        } 
        else if (command === 'clear') {
            output.innerHTML = '';
        } 
        else if (command === 'list') {
            output.innerHTML += `<div class="info">Buscando exercícios na pasta '${DEFAULT_FOLDER}' via GitHub API...</div>`;
            try {
                const url = `https://github.com{REPO_OWNER}/${REPO_NAME}/contents/${DEFAULT_FOLDER}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error('Não foi possível acessar a pasta do repositório.');
                
                const files = await response.json();
                
                // Filtra arquivos Java (.java) ou outras subpastas de exercícios
                const exercicios = files.filter(f => f.name.endsWith('.java') || f.type === 'dir');

                if(exercicios.length === 0) {
                    output.innerHTML += `<div>Nenhum arquivo ou exercício encontrado em '${DEFAULT_FOLDER}'.</div>`;
                    return;
                }

                let listHtml = `<div class="success">Exercícios localizados:</div>`;
                exercicios.forEach(f => {
                    const icon = f.type === 'dir' ? '📁' : '📄';
                    listHtml += `  ${icon} <span class="file-link" onclick="executeRead('${f.name}')">${f.name}</span><br>`;
                });
                listHtml += `<div class="info" style="margin-top:5px;">Dica: Digite 'read [nome_do_arquivo]' ou clique neles acima para abrir.</div>`;
                output.innerHTML += listHtml;
            } catch (error) {
                output.innerHTML += `<div class="error">Erro ao ler repositório: ${error.message}</div>`;
            }
        } 
        else if (command === 'read') {
            if (!arg) {
                output.innerHTML += `<div class="error">Erro: informe o nome do arquivo. Exemplo: read SeuArquivo.java</div>`;
                return;
            }
            await fetchAndDisplayFile(arg);
        } 
        else if (cmd !== '') {
            output.innerHTML += `<div class="error">Comando não reconhecido. Digite 'list' para ver os arquivos disponíveis.</div>`;
        }
    }

    async function fetchAndDisplayFile(fileName) {
        output.innerHTML += `<div class="info">Buscando conteúdo de ${fileName}...</div>`;
        try {
            const fileUrl = `https://github.com{REPO_OWNER}/${REPO_NAME}/contents/${DEFAULT_FOLDER}/${fileName}`;
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Arquivo ou pasta não encontrado.');
            
            const fileData = await response.json();
            
            if (fileData.type === 'dir') {
                output.innerHTML += `<div class="error">'${fileName}' é um diretório. Use o comando de listagem para navegar por subpastas (ajuste a variável DEFAULT_FOLDER se necessário).</div>`;
                return;
            }

          
            const decodedCode = decodeURIComponent(escape(atob(fileData.content)));
            
            output.innerHTML += `<div><span class="success">--- Exibindo: ${fileName} ---</span></div>`;
            output.innerHTML += `<pre class="code-box">${escapeHtml(decodedCode)}</pre>`;
        } catch (error) {
            output.innerHTML += `<div class="error">Erro ao carregar arquivo: ${error.message}</div>`;
        }
    }

    async function executeRead(name) {
        output.innerHTML += `<div><span class="prompt">angelo@poo-java:~$</span> read ${name}</div>`;
        await fetchAndDisplayFile(name);
        output.scrollTop = output.scrollHeight;
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
