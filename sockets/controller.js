const ContenedorMariaDB = require('../containers/contenedorMariaDB.js');
const ContenedorMongoDB = require('../containers/contenedorMongoDB.js');
const Normalizador = require('../models/Normalizador.js');
const Mensaje = require('../models/Mensaje.js');
const Producto = require('../models/Producto.js');
const normalizer = new Normalizador();


//Se instancian los contenedores que atenderan los mensajes y productos
const productos = new ContenedorMongoDB(Producto);
const mensajero = new ContenedorMongoDB(Mensaje);

const socketController = async (socket) => {
    socket.emit('productos',await productos.getAll());

    socket.on('new-product', async producto => {
        await productos.save(producto);
        socket.emit('productos', await productos.getAll());
    })

    const mensajes = await mensajero.getAll();
    const data = normalizer.getDataNormalized(mensajes)

    socket.emit('mensajes', data);

    socket.on('new-message', async mensaje => {
        await mensajero.save(mensaje)    

        const mensajes = await mensajero.getAll();
        const data = normalizer.getDataNormalized(mensajes)

        socket.emit('mensajes', data);
    })

}


module.exports = {
    socketController
}