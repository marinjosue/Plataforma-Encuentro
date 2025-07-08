const express = require('express');
const app = express();

const reservaRoutes = require('./routes/reserva.routes');

app.use(express.json());
app.use('/api/v1/reservas', reservaRoutes);

module.exports = app;
