-- Drop the database if it already exists
DROP DATABASE IF EXISTS company_db;

-- Create the database
CREATE DATABASE company_db;

-- Switch to the newly created database
USE company_db;

-- Create the department table
CREATE TABLE department (
  id INT NOT NULL,
  department_name VARCHAR(30),
  PRIMARY KEY (id)
);

-- Create the role table
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department (id)
);

-- Create the employee table
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role (id)
);

-- Create a view to combine employee, role, and department information
CREATE VIEW employee_info AS
SELECT 
  e.first_name,
  e.last_name,  
  r.title,
  d.department_name,
  r.salary
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id;
