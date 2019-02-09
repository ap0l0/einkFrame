var express = require('express');
var router = express.Router();

// Require controller modules.
var index_controller = require('../controllers/index');

router.get('/', index_controller.image_list);  


module.exports = router;
