const app = require('express')();
const classes = require('./classes');
const stud = require('./students');
const port = 3000;


/*  // --- To Test --- //

    
    



*/

app.get('/', (req, res) => {
    res.json({
        message: `BASE`
    })
});

app.get('/class/list', (req, res) => {


    const className = req.query.class;

    if (className) {

        classes.loadClass(className, (err, data) => {

            if (err) {
                res.json({
                    error: `Class ${className} doesn't exist.`
                });
            } else {
                res.json(data);
            }
        });
    } else {
        res.json({
            error: `Enter a Class Name`
        });
    }
});


app.get('/class/add/', (req, res) => {

    const className = req.query.class;
    const {
        name,
        age,
        city,
        grade
    } = req.query;
    let addStud = stud.valStudent({
        name,
        age,
        city,
        grade
    });

    classes.loadClass(className, (err, data) => {

        // if class doesn't exist 
        if (err) {

            const dataBlob = {
                students: []
            };

            if (addStud) {
                // if there is student info, create the object.
                dataBlob.students = [{
                    name,
                    age,
                    city,
                    grade,
                }];
            };


            classes.writeClass(className, dataBlob, (err, data) => {

                // create the new class, if there is student info, it will be added with class creation
                if (err) {
                    res.json(err)
                } else {
                    if (addStud) {

                        stud.writeStudList({
                            name,
                            age,
                            city,
                            grade
                        }, cb => {

                            res.json({
                                message: `Created new class ${className}`,
                                student: {
                                    name,
                                    age,
                                    city,
                                    grade
                                },
                            });
                        });
                    } else {
                        res.json({
                            message: `Created new class ${className}`,
                        });
                    };

                };

            });

            // if class does exist     
        } else {

            if (addStud) {

                // data from loaded class

                let newData = JSON.parse(JSON.stringify(data));

                const newStudent = {
                    name,
                    age,
                    city,
                    grade,
                };

                newData.students = stud.updateStudent(newStudent, newData.students);

                stud.writeStudList({
                    name,
                    age,
                    city,
                    grade
                }, cb => {

                    classes.writeClass(className, newData, (err, data) => {

                        if (err) {
                            res.json({
                                message: `Error adding ${name} to class ${className}`
                            });
                        } else {
                            res.json({
                                added: {
                                    name,
                                    age,
                                    city,
                                    grade
                                },
                                class: className,
                            });
                        };
                    });

                });


            } else {

                // student info was not filled out completely
                res.json({
                    error: 'Please fill out all the information for the student',
                });
            };
        };
    });
});

app.get('/class/listfailing/', (req, res) => {

    const className = req.query.class;

    // check if user entered a class 

    if (className) {

        classes.loadClass(className, (err, data) => {

            if (err) {

                // if class doesnt exist, return error

                res.json({
                    error: `Class ${className} doesn't exist.`
                });
            } else {

                // class exist, filter through students for failing grade

                const failingStudents = data.students.filter( e => {

                        return e.grade < 50;
                });
                

                

                if (failingStudents.length > 0) {
                    res.json({
                        class: className,
                        students: failingStudents,
                    });
                } else {

                    // if no students were found

                    res.json({
                        class: className,
                        students: failingStudents,
                        message: `No failing students in ${className}`,
                    });
                };
            };
        });


    } else {
        res.json({
            error: `Enter a Class Name`
        });
    }




});

app.get('/class/listfromcity/', (req, res) => {


const className = req.query.class;
const {city} = req.query;

    // check if user entered a class 

    if (className && city) {

        classes.loadClass(className, (err, data) => {

            if (err) {

                // if class doesnt exist, return error

                res.json({
                    
                    error: `Class ${className} doesn't exist.`
                });
            } else {

                // class exist, filter through students who live in city

                const cityStudents = data.students.filter( e => {
                    return e.city.toLowerCase() === city.toLowerCase();
                });

                

                if (cityStudents.length > 0) {
                    res.json({
                        class: className,
                        students: cityStudents,
                    });
                } else {

                    // if no students were found
                    
                    res.json({
                        class: className,
                        students: cityStudents,
                        message: `No students from ${city} in ${className}`,
                    });
                };
            };
        });


    } else {
        res.json({
            error: `Enter a Class Name & City`
        });
    }
});





app.listen(port, e => {
    console.log(`Listening on Port: ${port}.`);
});