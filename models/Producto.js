const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const ProductoSchema = Schema({
    nombre: { type: String },
    precio: { type: Number },
    foto: { type: String }
});

module.exports = model('Producto', ProductoSchema);

