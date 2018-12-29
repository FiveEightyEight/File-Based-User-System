const fs = require('fs');

const loadClass = (name, cb) => {

    fs.readFile(`./classes/${name}.json`, 'utf8', (err, data) => {

        if(err) {
            cb(err, data);    
        } else {
            cb(err, JSON.parse(data));
        };
    });
};

const writeClass = (name, dataBlob = {students: []}, cb) => {
    dataBlob = JSON.stringify(dataBlob);
    fs.writeFile(`./classes/${name}.json`, dataBlob, (err, data) => {
        cb(err, data);
    });

};


module.exports = {
    loadClass,
    writeClass,
};