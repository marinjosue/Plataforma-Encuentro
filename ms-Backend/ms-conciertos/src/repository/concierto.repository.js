const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function guardarConcierto(data) {
  const id = uuidv4();
  await db.query(`
    INSERT INTO conciertos (id, nombre, fecha, lugar, organizador_id)
    VALUES ($1, $2, $3, $4, $5)`,
    [id, data.nombre, data.fecha, data.lugar, data.organizador_id]);
  return { ...data, id };
}

async function obtenerTodos({ tipo, fecha }) {
  let query = 'SELECT * FROM conciertos WHERE 1=1';
  const params = [];

  if (tipo) {
    params.push(tipo);
    query += ` AND LOWER(nombre) LIKE '%' || LOWER($${params.length}) || '%'`;
  }

  if (fecha) {
    params.push(fecha);
    query += ` AND DATE(fecha) = $${params.length}`;
  }

  const res = await db.query(query, params);
  return res.rows;
}

async function obtenerPorId(id) {
  const res = await db.query('SELECT * FROM conciertos WHERE id = $1', [id]);
  return res.rows[0];
}

module.exports = {
  guardarConcierto,
  obtenerTodos,
  obtenerPorId
};
