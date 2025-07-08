const service = require('../services/reserva.service');
const ReservaDTO = require('../dto/reserva.dto');

exports.crear = async (req, res) => {
    try {
        const data = ReservaDTO.fromCreateRequest(req.body);
        const reserva = await service.crearReserva(data);
        res.status(201).json(reserva);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.confirmar = async (req, res) => {
    try {
        const data = ReservaDTO.fromConfirmRequest(req.body);
        const reserva = await service.confirmarReserva(data);
        if (!reserva) return res.status(404).json({ error: 'No encontrada' });
        res.json(reserva);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtener = async (req, res) => {
    try {
        const reserva = await service.obtenerReserva(req.params.id);
        if (!reserva) return res.status(404).json({ error: 'No encontrada' });
        res.json(reserva);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminar = async (req, res) => {
    try {
        await service.cancelarReserva(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
