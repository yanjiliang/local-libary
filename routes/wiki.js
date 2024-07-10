const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('维基主页');
});

router.post('/about', (req, res) => {
    res.send('关于维基');
});

module.exports = router;