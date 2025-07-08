const express = require('express');
const app = express();
const notificacionRoutes = require('./routes/notificacion.routes');

app.use(express.json());
app.use('/api/v1/notificaciones', notificacionRoutes);

module.exports = app;
