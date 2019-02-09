
var schedule = require('node-schedule'); //Module to Schedules Functions
var dateFormat = require('dateformat'); //Pretty Date Formats

//Import eInk Module
var eink = require('./eink');

//Import Reddit Module
var reddit = require('./reddit');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('motiframe.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('[INFO] Connected to SQlite database - Schedule Module');
});

/*
schedule.scheduleJob('* * 1 * *', function(){  // this for one hour
schedule.scheduleJob('* 5 * * *', function(){  // this for 5 minutes
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/


//Checking Images Status
function CheckNextImage() {
    let sql = 'SELECT * FROM images WHERE current_image="1" ORDER BY id LIMIT 1;'; //Selecting current image
    db.all(sql, [], (err, images) => {
        if (err) {
            throw err;
        }
        if (images.length == 0) {
            console.log('[ACTION] New DB -> Setting new Image');
            db.run('UPDATE images SET current_image=1 WHERE id=1;');
            //Here setup first image
        }
        else {

            eink.PushImage('./public/images/' + images[0].eInk_filename); //Sending next Image to eInk
            console.log('Sending image to eInk: ' + './public/images/' + images[0].eInk_filename);

            var nextImageId = images[0].id + 1;
            console.log('[ACTION] Resetting current image: ' + images[0].filename);
            db.run('UPDATE images SET current_image=0 WHERE id=?', [images[0].id]); //Resetting current image
            db.run('UPDATE images SET current_image=1 WHERE id=?', nextImageId, function (err) {
                if (err) {
                    throw err;
                }
                if (this.changes == 0) {
                    console.log('[INFO] Last image, restarting count.');
                    //db.run('UPDATE images SET current_image=1 WHERE id=1'); //Resetting current image
                }
            });
        }
    });
};

//reddit.UpdateImages(); 

//Showing images every 'x' in the eInk Display
var p = schedule.scheduleJob('*/5 * * * *', function () {  // 5 minutes later (bob sponge voice)
    var now = dateFormat(Date.now());
    CheckNextImage();
    console.log('[5] minutes: ' + now);
});

//Showing images every 'x' in the eInk Display
var d = schedule.scheduleJob('0 7 * * *', function () {  // Update Images every day at 7:00 AM  (0 7 * * *)
    var now = dateFormat(Date.now());
    reddit.UpdateImages();
    console.log('[Daily Update]: ' + now);
});
