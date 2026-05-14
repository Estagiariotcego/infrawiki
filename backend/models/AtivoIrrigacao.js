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

module.exports = mongoose.model('AtivoIrrigacao', ativoIrrigacaoSchema);