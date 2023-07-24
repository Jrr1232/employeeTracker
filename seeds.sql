INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Alex', 'Jones', 1, 1),
(2,'Junior','Gomez',2,2);


-- Inserting into the department table
INSERT INTO department (id, department_name)
VALUES (1, 'Engineering');

-- Inserting into the role table
INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Front End Developer', 98000.00, 1);