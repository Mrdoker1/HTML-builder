const fs = require('fs');
const { stdout } = process;
let data = '';

const stream = fs.createReadStream(__dirname + '/text.txt');

// stream.setEncoding('utf-8');

stream.on('data', chunk => {
    data += chunk;
});

stream.on('error', error => {
    stdout.write('Error', error.message);
});

stream.on('end', () => {
    stdout.write(data);
});