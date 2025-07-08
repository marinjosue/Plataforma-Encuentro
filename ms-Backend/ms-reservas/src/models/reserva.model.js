class Reserva {
    constructor({ id, evento_id, zona_id, cantidad, estado, vencimiento }) {
        this.id = id;
        this.evento_id = evento_id;
        this.zona_id = zona_id;
        this.cantidad = cantidad;
        this.estado = estado || 'temporal';
        this.vencimiento = vencimiento;
    }
}

module.exports = Reserva;
