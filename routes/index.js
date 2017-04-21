var express = require('express');
var router = express.Router();

router.value = 3;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/changeValue/:value', function(req, res, next) {
    router.value = req.params.value;
    res.send(req.params.value);
});

router.get('/value', function(req, res, next) {
    res.send(router.value);
});

module.exports = router;
