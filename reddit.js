'use strict';

/**************************************/
// Importing all the libraries neeeded for the project
const snoowrap = require('snoowrap');
var Jimp = require('jimp');
const imageDownload = require('image-download');
const imageType = require('image-type');
var fs = require('fs');
const path = require('path');

//DB Stuff
//Set up SQLite connection
const sqlite3 = require('sqlite3').verbose();
 
// open database in memory
let db = new sqlite3.Database('motiframe.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('[INFO] Connected to SQlite database.');
});
 


//END DB Config

/**************************************/
// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper
const r = new snoowrap({
  userAgent: 'MotiFrame/Bot v1',
  clientId: 'sh920Oc2ft1siw',
  clientSecret: 'vDQwW_TwVFyfZraGeVHA2uJBGtY',
  refreshToken: '57083482-j1q2HxrB32jA1KBud-93b4-Dsl0'
});


/**************************************/
//Downloading the data from Reddit and saving it in a JSON Array

module.exports = {

  //RemoveImages: function () {
  //},
  UpdateImages: function () {
    //Remove current Data
    deleteImgages();
    //Rebuilding new data
    r.getSubreddit('GetMotivated').getHot({ time: 'day', limit: 40 }).then(SaveData)
  
  }
}

//deleteImgages();
//r.getSubreddit('GetMotivated').getHot({ time: 'day', limit: 20 }).then(SaveData)



/**************************************/
//Preparing the data from Reddit for the Motive-Ink
function SaveData(topPost) {
  var imageID = 0;

  for (var i = 0; i < topPost.length; i++) {
    //Assigning top post value
    var url = topPost[i].url;
    var title = topPost[i].title;
    var type = topPost[i].link_flair_css_class;

    if (type == "image") {
      imageID += 1;
      /*
      console.log('ID: ' + imageID + '\n' +
        'Link: ' + url + '\n');
      */
      //Downloading Images
      downloadImages(url, imageID);
    }
    else {
      // console.log('No Image Detected, it is a ' + type);
    }
  }
  console.log('[INFO] Images downloaded and saved!');
};


/**************************************/
//Downloading Image from reddit or imgur
function downloadImages(imageUrl, imageID) {

  var source = 'reddit';

  if (imageUrl.includes("imgur")) {
    imageUrl = imageUrl + '.jpg'
    source = 'imgur';
  }

  imageDownload(imageUrl).then(buffer => {
    const type = imageType(buffer);

    var imageLoc = './public/images/' + imageID + '_Image_Original.' + type.ext;
    fs.writeFile(imageLoc, buffer, (err) => modifyImage(imageLoc, imageID, type.ext))

    //Saving image data to DB/*
    var newImage = {
      filename: imageID + '_Image_Original.' + type.ext,
      filepath: './public/images/' + imageID + '_Image_Original.' + type.ext,
      format: type.ext,
      source: source,
      downloaded_at: Date(),
      eInk_filename: imageID + '_Image_eInk.bmp',
      current_image: 0
    };
  
    saveToDB(newImage);
  });
}

//Saving Images to DB
function saveToDB(newImage) {
  db.run('INSERT INTO images (filename, filepath, format, source, downloaded_at, eInk_filename, current_image) VALUES(?,?,?,?,?,?,?)', [newImage.filename, newImage.filepath, newImage.format, newImage.source, newImage.downloaded_at, newImage.eInk_filename, newImage.current_image], function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
}

/**************************************/
//Modyfing image to make it eInk ready
function modifyImage(imagePath, imageID) {
  //Path for images eInk ready
  var imageeInk = './public/images/' + imageID + '_Image_eInk';

  Jimp.read(imagePath)
    .then(lenna => {
      return lenna
        .resize(640, 384) // resize
        .quality(20) // set JPEG quality
        .greyscale() // set greyscale
        .write(imageeInk + '.bmp'); // save
    })
    .catch(err => {
      console.error(err);
    });

  //deleteImg(imagePath);

}

//Deleting Temp Images
//The images that were initially downloaded and are not eInk ready
function deleteImgages() {

  //Removing Images collection from DB
  db.run('DELETE FROM images;', function(err) {
    if (err) {
      return console.log(err.message);
    }
  });


  const directory = './public/images/';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });

  console.log('[INFO] DB Images and local files cleaned.');
}

function closeDB(){
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
}







