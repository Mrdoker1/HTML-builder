const fs = require('fs');

const directory = __dirname + '/files/';
const directoryCopy = __dirname + '/files-copy/';

async function copyFiles(dir, dirCopy) {
    try {
        await fs.readdir(dir, { withFileTypes: true }, (err, files) => {

            files.forEach(file => {
                if (file.isFile()) {

                    fs.mkdir(dirCopy, { recursive: true }, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            fs.copyFile(dir + file.name, dirCopy + file.name, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            });
        });

    } catch (err) {
        console.error(err);
    }
}

copyFiles(directory, directoryCopy);