const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function createReserva({ evento_id, zona_id, cantidad }) {
    const id = uuidv4();
    const vencimiento = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    const result = await db.query(`
    INSERT INTO reservas (id, evento_id, zona_id, cantidad, estado, vencimiento)
    VALUES ($1, $2, $3, $4, 'temporal', $5)
    RETURNING *`,
        [id, evento_id, zona_id, cantidad, vencimiento]);
    return result.rows[0];
}

async function confirmarReserva(id) {
    const result = await db.query(`
    UPDATE reservas SET estado = 'confirmada'
    WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
}

async function getReservaById(id) {
    const result = await db.query(`SELECT * FROM reservas WHERE id = $1`, [id]);
    return result.rows[0];
}

async function deleteReserva(id) {
    await db.query(`DELETE FROM reservas WHERE id = $1`, [id]);
}

module.exports = {
    createReserva,
    confirmarReserva,
    getReservaById,
    deleteReserva
};
