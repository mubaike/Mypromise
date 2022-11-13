const fs = require('fs');

fs.readFile('./resource/content.txt',(err, data) => {
    if (err) throw err;

    console.log(data.toString());
});