const inquirer = require("inquirer");
const mysql = require('mysql2');
const showBanner = require('node-banner');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1304',
    database: 'company_db'
});
(async () => {
    await showBanner('Welcome to the Database', 'Please use accordingly.');




    async function init() {

        // The code for the init function (as provided in the snippet) goes here
        // Make sure to define 'choices', 'connection', and configure 'inquirer' before this function

        const choices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'];

        inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: choices,
            },
        ]).then((data) => {
            if (data.action === choices[0]) {
                console.log('View Employee');
                connection.query(
                    'SELECT * FROM `employee_info`',
                    function (err, results, fields) {
                        console.table(results);
                        init()
                    }

                );
            } else if (data.action === choices[1]) {
                console.log('Add Employee');
                connection.query(
                    'SELECT first_name, last_name FROM employee',
                    function (err, results, fields) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        const employeeNames = results.map(employee => `${employee.first_name} ${employee.last_name}`);
                        inquirer.prompt([
                            {
                                type: 'input',
                                message: "What is the employee's first name?",
                                name: 'fname',
                            }, {
                                type: 'input',
                                message: "What is the employee's last name?",
                                name: 'lname',
                            }, {
                                type: 'input',
                                message: "What is the employee's role?",
                                name: 'role',
                            }, {
                                type: 'list',
                                message: "Who is the employee's manager?",
                                name: 'manager',
                                choices: employeeNames,

                            },
                        ]).then((data) => {
                            const firstName = data.manager.split(' ', 1)
                            connection.query(`SELECT manager_id from employee WHERE first_name = '${firstName}'`, function (err, result) {
                                if (err) {
                                    console.error('Error selecting manager_id:', err);
                                } else {
                                    connection.query(`SELECT id from roles WHERE title = '${data.role}' `, function (err, roleresult) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            console.log(roleresult[0]); // Move this line inside the callback function here
                                            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                                            const values = [data.fname, data.lname, roleresult[0].id, result[0].id];
                                            connection.query(sql, values, function (err, result) {
                                                if (err) {
                                                    console.error('Error inserting data:', err);
                                                } else {
                                                    console.log('New employee added successfully.');
                                                    init()
                                                }
                                            });

                                        }
                                    }

                                    )
                                }
                            })

                        }
                        );
                    });
            } else if (data.action === choices[2]) {
                console.log("update employee role");
                connection.query(
                    'SELECT first_name, last_name FROM employee',
                    function (err, results, fields) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        const employeeNames = results.map(employee => `${employee.first_name} ${employee.last_name}`);

                        inquirer.prompt([
                            {
                                type: 'list',
                                message: 'Which employee would you like to update?',
                                name: 'update',
                                choices: employeeNames,
                            }
                        ]).then(employeeAnswers => {
                            const selectedEmployee = employeeAnswers.update;
                            console.log(selectedEmployee)
                            const { firstName, lastName } = results.find(employee => `${employee.first_name} ${employee.last_name}` === selectedEmployee);
                            const employeeName = selectedEmployee.split(' ');
                            console.log(employeeName[0])
                            connection.query(
                                'SELECT title FROM roles',
                                function (err, results, fields) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    const roles = results.map(role => role.title);
                                    inquirer.prompt([
                                        {
                                            type: 'list',
                                            message: 'Which role would you like to update?',
                                            name: 'update_role',
                                            choices: roles,
                                        }
                                    ]).then(roleAnswers => {
                                        const selectedRole = roleAnswers.update_role;

                                        const query = `UPDATE employee SET role_id = (SELECT id FROM roles WHERE title = '${selectedRole}')     
                                    WHERE first_name = '${employeeName[0]}' AND last_name = '${employeeName[1]}'`;
                                        connection.query(query,
                                            function (err, results, fields) {

                                                if (err) {
                                                    console.error(err);

                                                } else {
                                                    console.log(`Employee ${selectedEmployee} role updated to ${selectedRole}.`);
                                                    init()
                                                }
                                            }
                                        );
                                    });
                                }
                            );
                        });
                    }
                );
            } else if (data.action === choices[3]) {
                console.log('View All Roles');
                connection.query(
                    'SELECT title FROM roles',
                    function (err, results, fields) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        else {
                            const roles = results.map(role => role.title)
                            console.log(roles)
                            init()

                        }
                    })
            }
            else if (data.action === choices[4]) {
                console.log('Add Role');

                departments = ['Engineering', 'Sales', 'Legal', 'Finance', 'Service']
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'What is the name of the role?',
                        name: 'roleName',
                    },
                    {
                        type: 'input',
                        message: 'What is the salary of the role?',
                        name: 'salary',
                    },
                    {
                        type: 'list',
                        message: 'Which department does the role belong to?',
                        name: 'department',
                        choices: departments,
                    },
                ]).then((data) => {
                    const { roleName, salary, department } = data;

                    const departmentsql = 'SELECT id FROM department WHERE department_name = ?';
                    connection.query(departmentsql, [department], function (err, result) {
                        if (err) {
                            console.error('Error retrieving department_id:', err);
                        } else {
                            console.log(result)
                            if (result && result.length > 0) {

                                const departmentId = result[0].department_id;
                                const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
                                const values = [roleName, salary, result[0].id];

                                connection.query(sql, values, function (err, result) {
                                    if (err) {
                                        console.error('Error inserting data:', err);
                                    } else {
                                        console.log(`New role '${roleName}' added successfully.`);
                                    }
                                    init()
                                });
                            } else {
                                console.error(`Department '${department}' not found.`);
                                init()
                            }
                        }
                    });
                })
            } else if (data.action === choices[5]) {
                console.log('View All Departments ');
                connection.query(
                    'SELECT department_name FROM department',
                    function (err, results, fields) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        else {
                            const departments = results.map(department => department.department_name)
                            console.log(departments)
                            init()

                        }
                    })

            } else if (data.action === choices[6]) {
                console.log('Add Department ');
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'What is the name of the department?',
                        name: 'department_name',

                    },
                ]).then((data) => {
                    const sql = 'INSERT into department (department_name) VALUES (?)'
                    const values = [data.department_name];
                    connection.query(sql, values, function (err, result) {
                        if (err) {
                            console.error('Error inserting data:', err);
                        } else {
                            console.log(`New department '${data.department_name}' added successfully.`);
                            init()
                        }
                    });

                })

            } else if (data.action === choices[7]) {
                process.exit()


            }



            else {
                console.log('Invalid choice.');
            }
        }).catch((error) => {
            console.error('Error occurred:', error);
        });
    } init();

})
    ();

// Call the init function to start the application

