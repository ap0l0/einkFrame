//Communicating with Python
//https://github.com/mapbox/node-sqlite3/issues/933

let {PythonShell} = require('python-shell');

//Working with files
let fs = require('fs');

module.exports = {

	//Push Image to eInk Device
	PushImage: function (image_location) {
	runPython(image_location);
	}
  }

function runPython(image_location)
{
	//image_location = './public/images/2_Image_eInk.bmp';
	let options = {
        pythonPath: '/usr/bin/python',
        args: [image_location]
    };

	PythonShell.run('send2eink.py', options, pythonCallback);
	console.log('[EINK] Received ' + options.args);
	function pythonCallback(err, results)
	{
		dataFetchingInProgress = false;
		if (err)
		{
			console.error(err);
		}
		// results is an array consisting of messages collected during execution
		console.log('Log: %j', results);
	}
}

