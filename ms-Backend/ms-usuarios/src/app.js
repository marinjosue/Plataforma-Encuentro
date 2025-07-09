const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/usuarios', usuarioRoutes);

module.exports = app;
