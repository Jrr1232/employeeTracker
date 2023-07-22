INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Junior', 'Florencio', 3, 1);

-- Inserting into the department table
INSERT INTO department (department_id, department_name)
VALUES (1, 'IT');

-- Inserting into the role table
INSERT INTO role (role_id, title, salary, department_id)
VALUES (3, 'Front End Developer', 98000.00, 1);