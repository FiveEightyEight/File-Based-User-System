const app = require('express')();
const classes = require('./classes');
const stud = require('./students');
const port = 3000;


/*  // --- To Test --- //

    Loading student data from class json works fine
    updating student json not working
    
    instead of adding a new student obj, the total number of students is passed in

    problem may be the data being passed into student.js module updateStudent method or the method itself
    



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
                // data
                let newData = JSON.parse(JSON.stringify(data));
                console.log('NEWWWW DATA', newData)
                console.log(newData.students);
                // console.log(`Type of data.students: ${typeof data.students}`)
                // console.log(`add student?: ${addStud} /// newData: ${newData}`)
                // console.log(Object.keys(newData));

                // Adding a student to class
                const newStudent = {
                    name,
                    age,
                    city,
                    grade,
                };
                // const arr = [...data['students']]
                // console.log(`students array = ${newData['students']}`)
                // console.log(`arr = ${arr}`);
                // newData.students = JSON.parse(JSON.stringify(stud.updateStudent(newStudent, newData.students)));
                console.log("newStud:" , newStudent);
                console.log("newD.stud:" , newData.students);

                
                // newData.students = stud.updateStudent(newStudent, newData.students);
                newData.students = stud.updateStudent(newStudent, newData.students);


                // console.log(`POST!!!  updateStudent: ${newData.students}`)
                console.log("POST!!!  updateStudent:", newData.students)

                stud.writeStudList({
                    name,
                    age,
                    city,
                    grade
                }, cb => {
                    //console.log('Wrote Student info');

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