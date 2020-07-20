var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    name: 'Test',
    description: 'Test interface',
    space: 'Jayking'
  })
});

module.exports = router;
