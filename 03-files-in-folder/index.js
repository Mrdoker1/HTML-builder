const fs = require('fs');
const path = require('path');

async function filesInFolder(directory) {
    try {
        await fs.readdir(directory, { withFileTypes: true }, (err, files) => {

            files.forEach(file => {
                if (file.isFile()) {
                    fs.stat(directory + file.name, (err, stats) => {
                        if (err) {
                            console.log('File doesn\'t exist.');
                        } else {
                            console.log(`${file.name.replace(/\.[^.]*$/, '')} - ${path.extname(file.name)} - ${bytesToSize(stats.size)}`);
                        }
                    });
                }
            });
        });

    } catch (err) {
        console.error(err);
    }
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'kb', 'mb', 'gb', 'tb'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(3) + sizes[i];
}

filesInFolder(__dirname + '/secret-folder/');