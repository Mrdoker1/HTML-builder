const fs = require('fs');
const path = require('path');
//const fse = require('fs-extra');

class Builder {
    constructor(dirComponents, dirTemplate, dirStyles, dirAssets, dirOutput) {
        this.dirComponents = __dirname + dirComponents + '/';
        this.dirTemplate = __dirname + dirTemplate;
        this.dirStyles = __dirname + dirStyles + '/';
        this.dirAssets = __dirname + dirAssets + '/';
        this.dirOutput = __dirname + dirOutput + '/';
    }

    createBuild() {
        this.buildHTML();
        this.buildCSS();
        this.copyAssets();
    }

    async formHTML(files, fileAmount, templateData) {

        files.forEach((file, index) => {

            if (file.isFile() && path.extname(file.name) == '.html') {
                fs.readFile(this.dirComponents + file.name, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        let fileName = path.basename(file.name, path.extname(file.name));
                        templateData = templateData.replace('{{' + `${fileName}` + '}}', data);
                    }

                    if (index == fileAmount) {

                        fs.mkdir(this.dirOutput, { recursive: true }, (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                fs.writeFile(this.dirOutput + 'index.html', templateData, { flag: `${'a'}` }, err => {});
                            }
                        });
                        return templateData;
                    }
                });
            }
        });
    }
    async buildHTML() {
        try {
            await fs.readFile(this.dirTemplate, 'utf8', (err, templateData) => {
                if (err) {
                    console.error(err, 'Template not found!');
                    return;
                } else {
                    fs.readdir(this.dirComponents, { withFileTypes: true }, (err, files) => {

                        if (err) {
                            console.error(err, 'Directory not found!');
                        } else {

                            let fileAmount = -1;
                            files.forEach((file) => {
                                if (file.isFile() && path.extname(file.name) == '.html') {
                                    fileAmount++;
                                }
                            });

                            this.formHTML(files, fileAmount, templateData);
                        }
                    });

                }
            });
        } catch (err) {
            console.error(err);
        }
    }
    async buildCSS() {
        try {
            await fs.readdir(this.dirStyles, { withFileTypes: true }, (err, files) => {

                files.forEach(file => {

                    if (file.isFile() && path.extname(file.name) == '.css') {

                        fs.readFile(this.dirStyles + file.name, 'utf8', (err, data) => {
                            if (err) {
                                console.error(err);
                                return;
                            } else {
                                fs.mkdir(this.dirOutput, { recursive: true }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        fs.writeFile(this.dirOutput + 'style.css', data, { flag: `${'a'}` }, err => {});
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
    async copyAssetsEx() {
        try {
            await fs.mkdir(this.dirOutput, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    fs.mkdir(this.dirOutput + 'assets/', { recursive: true }, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            fse.copy(this.dirAssets, this.dirOutput + 'assets/')
                                .then(() => console.log('Files copied successfully!'))
                                .catch(err => console.error(err));
                        }
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
    async copyAssets() {
        try {
            await fs.readdir(this.dirAssets, { withFileTypes: true }, (err, folders) => {

                folders.forEach(folder => {
                    if (folder.isDirectory()) {

                        fs.mkdir(this.dirOutput + 'assets/' + folder.name, { recursive: true }, (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                fs.readdir(this.dirAssets + folder.name, { withFileTypes: true }, (err, files) => {

                                    files.forEach(file => {
                                        if (file.isFile()) {
                                            fs.copyFile(this.dirAssets + folder.name + '/' + file.name, this.dirOutput + 'assets/' + folder.name + '/' + file.name, (err) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                        }
                                    });
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
}

let builder = new Builder('/components', '/template.html', '/styles', '/assets', '/project-dist');
builder.createBuild();