//Set up SQLite connection
const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('motiframe.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('[INFO] Connected to SQlite database — Controler');
});


// Display list of all Authors.
exports.image_list = function (req, res) {

    let sql = 'SELECT * FROM images ORDER BY id;';

    db.all(sql, [], (err, images) => {
        if (err) {
            throw err;
        }
        res.render('index', { images_list: images });
        images.forEach((row) => {
            console.log(row.filepath);
        });
    });

    
/*

    Image.find({}, function (err, images) {
        if (err) throw err;
        res.render('index', { images_list: images });
    });
*/
};
