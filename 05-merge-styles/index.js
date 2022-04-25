const fs = require('fs');
const path = require('path');

const directory = __dirname + '/project-dist/';
const stylesDirectory = __dirname + '/styles/';

async function mergeStyles(stylesDir, dir) {
    try {
        await fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {

            files.forEach(file => {

                if (file.isFile() && path.extname(file.name) == '.css') {

                    fs.readFile(stylesDirectory + file.name, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        } else {
                            fs.writeFile(dir + 'bundle.css', data, { flag: `${'a'}` }, err => {});
                        }
                    })
                }
            });
        });

    } catch (err) {
        console.error(err);
    }
}

mergeStyles(stylesDirectory, directory);