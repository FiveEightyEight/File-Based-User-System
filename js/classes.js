const fs = require('fs');
const http = require('http');



const loadClass = (name, cb) => {
    fs.readFile(`./classes/${name}.json`, 'utf8', (err, data) => {
        cb(err, JSON.parse(data));
    });
};

const writeClass = (name, dataBlob = {
    students: []
}, cb) => {
    dataBlob = JSON.stringify(dataBlob);
    fs.writeFile(`./classes/${name}.json`, dataBlob, (err, data) => {
        cb(err, data);
    });
};



module.exports = {
    writeClass,
    loadClass,
};