const fs = require('fs');
const rl = require('readline');

class FileWriter {
    constructor(path, flag = 'a') {
        this.filename = path;
        this.flag = flag;
        this.data = '';
    }

    readData(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
    }

    async writeData() {

        try {
            await fs.promises.access(this.filename);
        } catch {
            this.createFile();
        }

        await this.readData(fs.createReadStream(this.filename)).then((data) => {
            let readline = rl.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            readline.on('line', (inputData) => {

                if (inputData === 'exit') {
                    readline.close();
                }

                fs.writeFile(this.filename, inputData, { flag: `${this.flag}` }, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });

            readline.on('close', () => {

                fs.writeFile(this.filename, data, { flag: `${this.flag}` }, err => {
                    if (err) {
                        console.log(err);
                    }
                });

                console.log('Process stopped');
                process.exit();
            });

            readline.on('sigint', () => {
                readline.close();
            });
        });
    }

    createFile() {
        fs.open(this.filename, 'w', error => {
            if (error) throw error;
        });
    }
}

console.log('Hi, enter your text please:');

let w = new FileWriter(__dirname + '/text.txt');
w.writeData();