const repo = require('../repository/reserva.repository');
const Reserva = require('../models/reserva.model');

async function crear(data) {
    const reserva = await repo.createReserva(data);
    return new Reserva(reserva);
}

async function confirmar(id, usuario_id) {
    const reserva = await repo.confirmarReserva(id, usuario_id);
    return new Reserva(reserva);
}

async function obtenerPorId(id) {
    const reserva = await repo.getReservaById(id);
    return new Reserva(reserva);
}

async function eliminar(id) {
    await repo.deleteReserva(id);
}

module.exports = {
    crear,
    confirmar,
    obtenerPorId,
    eliminar
};
