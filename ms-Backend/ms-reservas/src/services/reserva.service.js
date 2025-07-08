const repository = require('../repository/reserva.repository');
const { publishReservaConfirmada } = require('../config/rabbitmq');

async function crearReserva(data) {
    const reserva = await repository.createReserva(data);
    return reserva;
}

async function confirmarReserva({ reserva_id, metodo_pago }) {
    const reserva = await repository.confirmarReserva(reserva_id);
    if (reserva) {
        publishReservaConfirmada({
            type: 'reserva_confirmada',
            reserva_id,
            evento_id: reserva.evento_id,
            cantidad: reserva.cantidad
        });
    }
    return reserva;
}

async function obtenerReserva(id) {
    return await repository.getReservaById(id);
}

async function cancelarReserva(id) {
    await repository.deleteReserva(id);
}

module.exports = {
    crearReserva,
    confirmarReserva,
    obtenerReserva,
    cancelarReserva
};
