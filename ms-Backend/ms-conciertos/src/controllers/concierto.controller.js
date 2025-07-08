const ConciertoDTO = require('../dto/concierto.dto');
const service = require('../services/concierto.service');

exports.crear = async (req, res) => {
  try {
    const dto = ConciertoDTO.fromRequest(req.body);
    const concierto = await service.crear(dto);
    res.status(201).json(concierto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const conciertos = await service.listar(req.query);
    res.json(conciertos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const concierto = await service.buscarPorId(req.params.id);
    if (!concierto) return res.status(404).json({ error: 'Concierto no encontrado' });
    res.json(concierto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
