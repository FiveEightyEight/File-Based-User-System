const fs = require('fs');
const FILE_NAME = 'students.json';


const loadStudList = (cb) => {
    fs.readFile(`./students/${FILE_NAME}`, 'utf8', (err, data) => {

        // console.log(`Reading File... e: ${err} data: ${data}`)

        if (err) {
            buildFile((e, d) => {
                fs.readFile(`./students/${FILE_NAME}`, 'utf8', (newErr, newData) => {
                    cb(err, JSON.parse(newData));
                });
            });
        } else {

            // console.log(`No Error In Read... Returning Data`)

            cb(err, JSON.parse(data));
        };
    });
};

const writeStudList = (dataBlob, cb) => {
    // console.log(`write ->`)

    if (valStudent(dataBlob)) {
        // console.log(`write -> val ->`)

        loadStudList((e, loadData) => {
            // console.log(`write -> val -> load -> e: ${e} loadData: ${loadData}`)

            if (e) {


                // console.log(`write -> val -> load -> e -> e: ${e} loadData: ${loadData}`)

                dataBlob = JSON.stringify([dataBlob]);
                fs.writeFile(`./students/${FILE_NAME}`, dataBlob, (err, data) => {
                    cb(err, data);
                });

            } else {

                // console.log(`write -> val -> load -> NO E (else) -> e: ${e} loadData: ${loadData}`)

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
            // console.log(`in updatestudent loop`)
            console.log('loop', arr[i])
            if (arr[i].name === student.name) {
                arr[i] = student;
                exists = true;
            };
        };

        if (exists) {

           console.log('EXISTS: ', arr)
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