const repository = require('../repository/concierto.repository');
const Concierto = require('../models/concierto.model');

async function crear(data) {
  const concierto = new Concierto(data);
  return await repository.guardarConcierto(concierto);
}

async function listar(filtros) {
  return await repository.obtenerTodos(filtros);
}

async function buscarPorId(id) {
  return await repository.obtenerPorId(id);
}

module.exports = {
  crear,
  listar,
  buscarPorId
};
