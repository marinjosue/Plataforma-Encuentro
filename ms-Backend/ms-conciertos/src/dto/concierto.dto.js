class ConciertoDTO {
  static fromRequest(body) {
    return {
      nombre: body.nombre,
      fecha: new Date(body.fecha),
      lugar: body.lugar,
      organizador_id: body.organizador_id
    };
  }
}

module.exports = ConciertoDTO;
