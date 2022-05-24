const fs = require('fs');

const directory = __dirname + '/files/';
const directoryCopy = __dirname + '/files-copy/';

async function copyFiles(dir, dirCopy) {
    try {
        fs.access(dirCopy, (err) => {
            if (err) {
                create(dir, dirCopy);
            } else {
                fs.rm(dirCopy, { recursive: true }, (err) => {
                    if (err) {
                        throw err;
                    }
                    create(dir, dirCopy);
                });
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function create(dir, dirCopy) {
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
}


copyFiles(directory, directoryCopy);