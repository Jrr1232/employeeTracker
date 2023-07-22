const inquirer = require("inquirer");
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lilj1304',
    database: 'company_db'
});
const choices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'];
async function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action', // Renamed 'name' to 'action'
            message: 'What would you like to do?',
            choices: choices,
        },
    ])
        .then((data) => {
            // Process user selection here based on data.action
            if (data.action === choices[0]) {
                console.log('View All Employees chosen');
                connection.query(
                    'SELECT * FROM `employee_info`',
                    function (err, results, fields) {
                        console.table(results); // results contains rows returned by server
                    }
                );

            } else if (data.action === choices[1]) {
                inquirer
                    .prompt([
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
                    ])
                    .then((data) => {
                        const sql = 'INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                        const values = [data.fname, data.lname, data.role, data.manager];

                        connection.query(sql, values, function (err, result) {
                            if (err) {
                                console.error('Error inserting data:', err);
                            } else {
                                console.log('New employee added successfully.');
                            }


                            // Close the database connection
                            connection.end();
                        });



                    })


            } else if (data.action === choices[2]) {

                console.log('Update Employee Role chosen');
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
        })
        .catch((error) => {
            console.error('Error occurred:', error);
        });
}

// Call the init function to start the application
init();
