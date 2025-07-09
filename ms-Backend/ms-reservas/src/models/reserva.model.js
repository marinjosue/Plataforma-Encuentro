class Reserva {
    constructor({ id, evento_id, zona_id, cantidad, estado, vencimiento,usuario_id }) {
        this.id = id;
        this.evento_id = evento_id;
        this.zona_id = zona_id;
        this.cantidad = cantidad;
        this.estado = estado || 'temporal';
        this.vencimiento = vencimiento;
        this.usuario_id = usuario_id;
    }
}

module.exports = Reserva;
