var express = require('express');
var router = express.Router();

var api_controller = require('../controllers/api');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('API response');
});

router.get('/reload-images', api_controller.reload_images);
router.get('/delete-image/:id', api_controller.delete_image);

module.exports = router;
