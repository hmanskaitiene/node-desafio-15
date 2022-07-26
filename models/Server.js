const express = require('express');
const handlebars = require('express-handlebars')
const {engine} = handlebars;
const path = require('path');
const passport = require('passport');
const cluster = require('cluster');
const core = require('os');
const cookieParser = require('cookie-parser')

const { socketController } = require('../sockets/controller');
const routerProductos = require("../routes/productos.js");
const routerInfo = require("../routes/info.js");
const routerAuth = require("../routes/auth.js");
const routerRandom = require("../routes/randoms.js");

const argv = require('../config/yargs');
const { dbConnection } = require('../config/db.js');
const { baseSession } = require('../config/session.js');
const loggerMiddleware = require('../middlewares/logger.js')
const { initializePassport } = require('../config/passport.config.js');
const logger = require('../utils/logger.js')


class Server {

    constructor() {
        this.app  = express();
        this.server = require('http').createServer( this.app );
        this.io     = require('socket.io')( this.server );
        this.port = process.env.PORT || 8080;
        //this.port = argv.port ? argv.port : argv._.length > 0 ? argv._[0] : 8080
        this.modo = argv.modo || 'fork';
        this.administrador = false;
        this.logger = logger;

        this.paths = {
            productos: '/api/productos-test',
            auth:      '/',
            info:      '/',
            random:    '/api',
        }

        this.conectarDB();
        this.middlewares();
        this.routes();
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        this.app.use(loggerMiddleware);
        this.app.use( express.json() );
        this.app.use( express.static('public') );
        this.app.use(cookieParser());
        this.app.use(baseSession);
        initializePassport();
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.engine(
            "hbs",
            engine({
                extname: ".hbs",
                defaultLayout: "layout.hbs",
            })
          );
          
        this.app.set("views", "./views");
        this.app.set("view engine", "hbs");
        this.app.set("logger", this.logger);
  
    }

    routes() {
        this.app.use( this.paths.auth, routerAuth );
        this.app.use( this.paths.productos, routerProductos);
        this.app.use( this.paths.info, routerInfo );
        this.app.use( this.paths.random, routerRandom );

        this.app.use("*", (req, res) => {
            const error_message = `Ruta ${req.originalUrl} método ${req.method} no implementada`;
            this.logger.warn(error_message)
            res.status(404).json({"message": error_message})
        });

    }

    sockets() {
        this.io.on('connection', socketController );
    }

    start() {
        if (this.modo !== 'fork'){
            if (cluster.isPrimary) {
                this.logger.info(`Proceso principal ID:(${process.pid})`)
                for(let i = 0; i <  core.cpus().length; i++) {
                    cluster.fork();
                }
            
                cluster.on('exit', (worker) => {
                    cluster.fork();
                });
            
            } else {
                this.listen();
            }
        } else {
            this.listen();
        }
    }


    listen() {
        this.server.listen( this.port, () => {
            this.logger.info(`Servidor corriendo en puerto ${this.port}`)
        });
    }

}

module.exports = Server;
