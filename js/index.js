const app = require('express')();
const classes = require('./classes');
const stud = require('./students');
const port = 3000;


/*  // --- To Test --- //

    JSON parse for loads are now done in modules
    Added function in student module that validates a student object 


*/

app.get('/', (req, res) => {
    res.json({
        message: `BASE`
    })
});

app.get('/class/list', (req, res) => {

    const className = req.query.class;

    classes.loadClass(className, (err, data) => {

        if (err) {
            res.json({
                error: `Class ${className} doesn't exist.`
            });
        } else {

            res.json(data);
        }
    });
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
                const newData = data;

                // Adding a student to class
                const newStudent = {
                    name,
                    age,
                    city,
                    grade,
                };

                newData.students = classes.updateStudent(newStudent, newData.students);

                stud.writeStudList({
                    name,
                    age,
                    city,
                    grade
                }, cb => {
                    console.log('Wrote Student info');
                });

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

            } else {

                // student info was not filled out completely
                res.json({
                    error: 'Please fill out all the information for the student',
                });
            };
        };
    });

    // classes.writeClass(`${className}`, (err, data) => {

    //     if(err) {
    //         console.log(`ERROR: ${err}`)
    //     }
    //     res.json({
    //         message: `Complete`
    //     })
    //     // console.log(`Complete`)
    // });


});





app.listen(port, e => {
    console.log(`Listening on Port: ${port}.`);
});