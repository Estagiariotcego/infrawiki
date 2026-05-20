const fs = require('fs');

async function injetarDados() {
    console.log("⏳ Lendo o arquivo CSV...");
    const arquivo = fs.readFileSync('inventario_completo.csv', 'utf-8');
    
    // Separa por linhas e ignora linhas vazias
    const linhas = arquivo.split('\n').filter(linha => linha.trim() !== '');
    linhas.shift(); // Pula a primeira linha (cabeçalho)

    console.log(`🚀 Iniciando o envio de ${linhas.length} ativos para o banco...`);

    let sucesso = 0;
    let erros = 0;

    // Envia um por um para não sobrecarregar o servidor
    for (let i = 0; i < linhas.length; i++) {
        // Limpa caracteres especiais do Excel e separa as colunas
        const colunas = linhas[i].replace('\ufeff', '').replace('\r', '').split(';');
        
        const payload = {
            FM_Codigo_Ativo: colunas[0],
            FM_Setor_Irrigacao: colunas[1],
            categoria_revit: colunas[2],
            componente: colunas[3],
            sigla: colunas[4],
            Endereco_IoT: colunas[5],
            fabricante: colunas[6],
            modelo: colunas[7]
        };

        try {
            const response = await fetch('http://localhost:5000/api/ativos-irrigacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 201) {
                sucesso++;
                // Avisa o progresso a cada 100 itens para você saber que não travou
                if (sucesso % 100 === 0) console.log(`✅ ${sucesso} ativos já foram cadastrados...`);
            } else {
                erros++;
            }
        } catch (error) {
            erros++;
        }
    }

    console.log(`\n🎉 INJEÇÃO CONCLUÍDA!`);
    console.log(`🟢 Cadastrados com sucesso: ${sucesso}`);
    console.log(`🔴 Ignorados (Já existiam no banco): ${erros}`);
    console.log(`Vá para o seu Dashboard e dê um F5!`);
}

injetarDados();