const fs = require('fs');

// O '\ufeff' no início conserta os acentos, e usamos ';' para separar as colunas perfeitamente
let csvContent = "\ufeffFM_Codigo_Ativo;FM_Setor_Irrigacao;Categoria_Revit;Componente;Sigla;Endereco_IoT;Fabricante;Modelo\n";

// 1. Bomba, Painel e Sensor
csvContent += "IRR-BMB-GER-01;GERAL;Equipamento Mecânico;Conjunto Motobomba 10CV;BMB;;Schneider;ME-23100V\n";
csvContent += "IRR-CTR-GER-01;GERAL;Equipamento Elétrico;Controlador Principal;CTR;;Rain Bird;ESP-LXD\n";
csvContent += "IRR-SEN-GER-01;GERAL;Dispositivo de Dados;Sensor de Chuva;SEN;;Rain Bird;N/A\n";

// 2. Controladores das Floreiras (9 unidades)
for(let i=1; i<=9; i++) {
    let num = String(i).padStart(2, '0');
    csvContent += `IRR-CTR-FLO-${num};FLOREIRAS;Equipamento Elétrico;Controlador Secundário;CTR;;Hunter;Node 100\n`;
}

// 3. Decodificadores (35 un FD101 e 4 un FD401)
for(let i=1; i<=35; i++) {
    let num = String(i).padStart(2, '0');
    csvContent += `IRR-DEC-GER-${num};GERAL;Dispositivo de Dados;Decodificador FD101;DEC;;Rain Bird;FD101\n`;
}
for(let i=36; i<=39; i++) {
    let num = String(i).padStart(2, '0');
    csvContent += `IRR-DEC-GER-${num};GERAL;Dispositivo de Dados;Decodificador FD401;DEC;;Rain Bird;FD401\n`;
}

// 4. Eletroválvulas (50 unidades)
for(let i=1; i<=50; i++) {
    let num = String(i).padStart(2, '0');
    csvContent += `IRR-VLV-S${num}-01;S${num};Acessório de Tubulação;Válvula Solenoide 1.1/2;VLV;;Rain Bird;150 PGA\n`;
}

// Função para distribuir os milhares de aspersores
function adicionarEmissores(prefixo, categoria, componente, sigla, fabricante, modelo, total) {
    let qtdPorSetor = Math.floor(total / 50);
    let resto = total % 50;
    
    for (let setor = 1; setor <= 50; setor++) {
        let setorStr = String(setor).padStart(2, '0');
        let limite = qtdPorSetor + (setor <= resto ? 1 : 0);
        
        for (let i = 1; i <= limite; i++) {
            let idStr = String(i).padStart(3, '0');
            csvContent += `IRR-${prefixo}-S${setorStr}-${idStr};S${setorStr};${categoria};${componente};${sigla};;${fabricante};${modelo}\n`;
        }
    }
}

// 5. Inserindo todos os Emissores listados no Memorial
adicionarEmissores("ASP", "Aspersor", "Aspersor Spray", "ASP", "Rain Bird", "1804 SAM", 1276);
adicionarEmissores("ASP", "Aspersor", "Aspersor Unispray", "ASP", "Rain Bird", "Unispray 200", 65);
adicionarEmissores("ASP", "Aspersor", "Rotor", "ASP", "Rain Bird", "3500", 133);
adicionarEmissores("ASP", "Aspersor", "Rotor Rain Curtain", "ASP", "Rain Bird", "5004", 37);
adicionarEmissores("BBL", "Aspersor", "Borbulhador Autocompensante", "BBL", "Rain Bird", "1804", 65);

// Gravar o arquivo final
fs.writeFileSync('inventario_completo.csv', csvContent, 'utf-8');
console.log("✅ Arquivo 'inventario_completo.csv' gerado e corrigido para o Excel brasileiro!");