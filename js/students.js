const fs = require('fs');
const FILE_NAME = 'students.json';


const loadStudList = (cb) => {
    fs.readFile(`./students/${FILE_NAME}`, 'utf8', (err, data) => {

        if (err) {
            buildFile((e, d) => {
                fs.readFile(`./students/${FILE_NAME}`, 'utf8', (newErr, newData) => {
                    cb(err, JSON.parse(newData));
                });
            });
        } else {

            cb(err, JSON.parse(data));
        };
    });
};

const writeStudList = (dataBlob, cb) => {

    if (valStudent(dataBlob)) {
        loadStudList((e, loadData) => {

            if (e) {

                dataBlob = JSON.stringify([dataBlob]);
                fs.writeFile(`./students/${FILE_NAME}`, dataBlob, (err, data) => {
                    cb(err, data);
                });

            } else {

                if (Object.keys(loadData).length === 0) {
                    loadData = [];
                }
                loadData.push(dataBlob);
                dataBlob = JSON.stringify(loadData);
                fs.writeFile(`./students/${FILE_NAME}`, dataBlob, (err, data) => {
                    cb(err, data);
                });
            }

        });

    } else {

        return {
            message: `Student info invalid.`,
        };
    };
};

const buildFile = (cb) => {
    let dataBlob = [];
    dataBlob = JSON.stringify(dataBlob);
    fs.writeFile(`./students/${FILE_NAME}`, dataBlob, (err, data) => {
        cb(err, data);
    });
};

const searchStudent = (obj) => {
    if (valStudent(obj)) {
        const {
            name,
            age,
            city,
            grade,
        } = obj;
        loadStudList(data => {
            // compare student data
            // data
        });
    } else {
        return {
            message: `Student info invalid.`,
        };
    };
};

const valStudent = (obj) => {
    const {
        name,
        age,
        city,
        grade
    } = obj;

    if (name && age && city && grade) {
        return true;
    } else {
        return false;
    };

};

const updateStudent = (student, arr) => {

    if (Array.isArray(arr)) {
        let exists = false;

        for (let i = 0; i < arr.length; i++) {

            if (arr[i].name.toLowerCase() === student.name.toLowerCase()) {
                arr[i] = student;
                exists = true;
            };
        };

        if (exists) {
            return arr;
        } else {
            arr.push(student);
            return arr;
        };
    };
};


module.exports = {

    loadStudList,
    writeStudList,
    valStudent,
    updateStudent,

};

// const express = require('express');

// const app = express();

// console.log(express);


// const Math = (function () { // IIFE
//     const add = (...rest) => rest.reduce((sum, a) => sum + a, 0)
//     const multiply = (...rest) => rest.reduce((sum, a) => sum * a, 1)
//     const divide = (...rest) => rest.reduce((sum, a) => sum / a, 1)
//     const subtract = (...rest) => rest.reduce((sum, a) => sum - a)

//     return {
//       add,
//       multiply,
//       divide,
//       subtract
//     }
//    })();


/*
 
Loop takes an array


    const colors = ['rd', 'pp', 'gr'];
    const shape = ['ov', 'sq', 'di'];
    const number = ['n1', 'n2', 'n3'];
    const shading = ['sd', 'st', 'ol'];


    colors calls shape

    shape calls number
    
    number calls shading 
    
    shading is base case

 */

const builder = (arr) => {
    if (arr.length === 1) {
        return arr;
    }

    return [arr[0]].concat(builder(arr.slice(1)))
};