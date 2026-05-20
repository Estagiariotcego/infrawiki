import requests
import random
import time

API_URL = "http://localhost:5000/api/ativos-irrigacao"

def simular_iot():
    print("🌍 Conectando ao Banco de Dados...")
    
    try:
        resposta = requests.get(API_URL)
        ativos = resposta.json()
    except Exception as e:
        print("❌ Erro ao conectar com o servidor Node.js. Ele está rodando?")
        return

    # Vamos simular apenas os "Cérebros" (Válvulas e Decodificadores)
    equipamentos_iot = [a for a in ativos if a.get('sigla') in ['VLV', 'DEC', 'CTR']]
    
    if not equipamentos_iot:
        print("⚠️ Nenhum equipamento IoT encontrado para simular.")
        return

    print(f"✅ {len(equipamentos_iot)} equipamentos IoT conectados. Iniciando transmissão...\n")

    status_possiveis = ["Regando 💦", "Offline 🔴", "Online 🟢", "Standby ⏳"]

    # Loop infinito: Fica mandando dados a cada 5 segundos
    while True:
        # Sorteia 3 equipamentos aleatórios
        alvos = random.sample(equipamentos_iot, 3)
        
        for ativo in alvos:
            codigo = ativo['FM_Codigo_Ativo']
            novo_status = random.choice(status_possiveis)
            
            try:
                requests.put(f"{API_URL}/{codigo}", json={"status": novo_status})
                print(f"📡 Atualizado: [{codigo}] -> {novo_status}")
            except:
                print(f"⚠️ Falha ao atualizar {codigo}")
            
        print("-" * 40)
        print("⏳ Aguardando 5 segundos para a próxima leitura...\n")
        time.sleep(5)

if __name__ == "__main__":
    simular_iot()