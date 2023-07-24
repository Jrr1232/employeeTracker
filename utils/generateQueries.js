// Import necessary modules and configure the inquirer object (not shown in the provided code)
const inquirer = require("inquirer");
const mysql = require('mysql2');

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
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Add first name',
                    name: 'fname',
                }, {
                    type: 'input',
                    message: 'Add last name',
                    name: 'lname',
                }, {
                    type: 'input',
                    message: 'Add role ',
                    name: 'role',
                }, {
                    type: 'input',
                    message: 'Add manager id',
                    name: 'manager',
                },
            ]).then((data) => {
                const sql = 'INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                const values = [data.fname, data.lname, data.role, data.manager];

                connection.query(sql, values, function (err, result) {
                    if (err) {
                        console.error('Error inserting data:', err);
                    } else {
                        console.log('New employee added successfully.');
                    }
                    connection.end();
                });
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
            console.log('View All Roles chosen');
        } else if (data.action === choices[4]) {
            console.log('Add Role chosen');
        } else if (data.action === choices[5]) {
            console.log('View All Departments chosen');
        } else if (data.action === choices[6]) {
            console.log('Add Department chosen');
        } else {
            console.log('Invalid choice.');
        }
    }).catch((error) => {
        console.error('Error occurred:', error);
    });
}

module.exports = init;
