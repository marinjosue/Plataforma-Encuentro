const express = require('express');
const app = express();
const entradaRoutes = require('./routes/entrada.routes');

app.use(express.json());
app.use('/api/v1/entradas', entradaRoutes);

module.exports = app;
