const mongoose = require('mongoose');

const ativoIrrigacaoSchema = new mongoose.Schema({
  FM_Codigo_Ativo: { type: String, required: true, unique: true },
  FM_Setor_Irrigacao: String,
  categoria_revit: String,
  componente: String,
  sigla: String,
  parametrosInstancia: String,
  parametrosTipo: String,
  IoT_IP_Dispositivo: String
}, { timestamps: true });

// O pulo do gato: verifica se o modelo já existe na memória antes de recriar
module.exports = mongoose.models.AtivoIrrigacao || mongoose.model('AtivoIrrigacao', ativoIrrigacaoSchema);