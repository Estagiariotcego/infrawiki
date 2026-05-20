const mongoose = require('mongoose');

const ativoIrrigacaoSchema = new mongoose.Schema({
  FM_Codigo_Ativo: { type: String, required: true, unique: true },
  FM_Setor_Irrigacao: String,
  categoria_revit: String,
  componente: String,
  sigla: String,
  Endereco_IoT: String,
  fabricante: String,
  modelo: String,
  status: String // <--- ADICIONAMOS O CAMPO AQUI!
}, { timestamps: true });

module.exports = mongoose.models.AtivoIrrigacao || mongoose.model('AtivoIrrigacao', ativoIrrigacaoSchema);