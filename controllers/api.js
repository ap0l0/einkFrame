//Import Reddit Module
var reddit = require('../reddit');

//Set up SQLite connection
const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('motiframe.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('[INFO] Connected to SQlite database — API Controler');
});


//Reloading all images
exports.reload_images = function (req, res) {

    console.log('[API] Controller Reloading Images');
    reddit.UpdateImages();
    res.send('Controller API Reload Images');
};

exports.delete_image = function (req, res) {

    console.log('[API] Deleting Image ' + req.params.id);
  

    db.all('DELETE FROM images WHERE id=?', req.params.id, function(err) {
        if (err) {
            throw err;
        }
        res.send('Deleted Image ' + req.params.id);

    });

};

