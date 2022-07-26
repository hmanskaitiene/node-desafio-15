const { Router } = require('express');
const { info } = require('../controllers/info');
const compression = require('compression');
const router = Router();

//Aplicada compresion sólo a esta ruta
router.get('/info',compression({
    level:5
}), info)

module.exports = router;