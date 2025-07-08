class Concierto {
  constructor({ id, nombre, fecha, lugar, organizador_id }) {
    this.id = id;
    this.nombre = nombre;
    this.fecha = fecha;
    this.lugar = lugar;
    this.organizador_id = organizador_id;
  }
}

module.exports = Concierto;
