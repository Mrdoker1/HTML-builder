const fs = require('fs');
const path = require('path');

const directory = __dirname + '/project-dist/';
const stylesDirectory = __dirname + '/styles/';

async function mergeStyles(stylesDir, dir) {
    try {
        fs.access(dir + 'bundle.css', (err) => {
            if (err) {
                merge(stylesDir, dir);
            } else {
                fs.rm(dir + 'bundle.css', { recursive: false }, (err) => {
                    if (err) {
                        throw err;
                    }
                    merge(stylesDir, dir);
                });
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function merge(stylesDir, dir) {
    await fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
        files.forEach(file => {
            if (file.isFile() && path.extname(file.name) == '.css') {
                fs.readFile(stylesDirectory + file.name, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        fs.writeFile(dir + 'bundle.css', data, { flag: `${'a'}` }, err => { console.log(err); });
                    }
                });
            }
        });
    });
}

mergeStyles(stylesDirectory, directory);