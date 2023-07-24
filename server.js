const inquirer = require("inquirer");
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1304',
    database: 'company_db'
});
async function init() {
    // The code for the init function (as provided in the snippet) goes here
    // Make sure to define 'choices', 'connection', and configure 'inquirer' before this function
    const choices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'];

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: choices,
        },
    ]).then((data) => {
        if (data.action === choices[0]) {
            console.log('View All Employees chosen');
            connection.query(
                'SELECT * FROM `employee_info`',
                function (err, results, fields) {
                    console.table(results);
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
                        console.log(firstName[0])
                        connection.query(`SELECT manager_id from employee WHERE first_name = '${firstName}'`, function (err, result) {
                            if (err) {
                                console.error('Error selecting manager_id:', err);
                            } else {
                                console.log(result)
                                connection.query(`SELECT id from role WHERE title = '${data.role}' `), function (err, roleresult) {
                                    if (err) {
                                        console.error(err);
                                    }
                                    else {
                                        const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                                        console.log(roleresult[0])
                                        const values = [data.fname, data.lname, roleresult[0], result[0]];
                                        console.log(data.fname)
                                        connection.query(sql, values, function (err, result) {
                                            if (err) {
                                                console.error('Error inserting data:', err);
                                            } else {
                                                console.log('New employee added successfully.');
                                            }
                                            connection.end();
                                        });

                                    }
                                }

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
                        // Use selectedEmployee to find the correct first_name and last_name
                        const { firstName, lastName } = results.find(employee => `${employee.first_name} ${employee.last_name}` === selectedEmployee);

                        connection.query(
                            'SELECT title FROM role',
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
                                    const query = `UPDATE employee SET role_id = (SELECT role_id FROM role WHERE title = '${selectedRole}')     
                                    WHERE first_name = '${firstName}' AND last_name = '${lastName}';`;
                                    connection.query(
                                        query,
                                        [selectedRole, selectedEmployee],
                                        function (err, results, fields) {
                                            if (err) {
                                                console.error(err);
                                            } else {
                                                console.log(`Employee ${selectedEmployee} role updated to ${selectedRole}.`);
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
            connection.query(
                'SELECT title FROM role',
                function (err, results, fields) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    else {
                        const roles = results.map(role => role.title)
                        console.log(roles)

                    }
                })
            console.log('View All Roles ');
        }
        else if (data.action === choices[4]) {
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
                            const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
                            const values = [roleName, salary, departmentId];

                            connection.query(sql, values, function (err, result) {
                                if (err) {
                                    console.error('Error inserting data:', err);
                                } else {
                                    console.log(`New role '${roleName}' added successfully.`);
                                }
                                connection.end();
                            });
                        } else {
                            console.error(`Department '${department}' not found.`);
                            connection.end();
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

                    }
                })

        } else if (data.action === choices[6]) {
            console.log('Add Department ');
        } else {
            console.log('Invalid choice.');
        }
    }).catch((error) => {
        console.error('Error occurred:', error);
    });
}

// Call the init function to start the application
init();
