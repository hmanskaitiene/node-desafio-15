const { Router } = require('express');
const { randoms } = require('../controllers/randoms');
const router = Router();

router.get('/randoms',randoms)

module.exports = router;