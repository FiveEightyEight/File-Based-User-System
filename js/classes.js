const fs = require('fs');
const http = require('http');



const loadClass = (name, cb) => {
    fs.readFile(`./classes/${name}.json`, 'utf8', (err, data) => {
        cb(err, JSON.parse(data));
    });
};

const writeClass = (name, dataBlob = {students: []}, cb) => {
    dataBlob = JSON.stringify(dataBlob);
    fs.writeFile(`./classes/${name}.json`, dataBlob, (err, data) => {
        cb(err, data);
    });
};

const updateStudent = (student, arr) => {

    let exists = false;

    for (let i = 0; i < arr.length; i ++) {

        if (arr[i].name === student.name) {
            arr[i] = student;
            exists = true;
        };
    };

    if (exists) {
    return arr;
    } else {
        return arr.push(student);
    }
};



module.exports = {
    writeClass,
    loadClass,
    updateStudent,
};