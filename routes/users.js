var express = require('express');
var router = express.Router();

var index = require('./index');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/changeValue/:value', function(req, res, next) {
    index.value = req.params.value;
    res.send(req.params.value);
});

router.get('/value', function(req, res, next) {
    res.send(index.value);
});

module.exports = router;
