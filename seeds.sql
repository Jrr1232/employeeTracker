INSERT INTO department (id, department_name)
VALUES (1, 'Engineering'),
(2,'Sales')

;
INSERT INTO roles (id, title, salary, department_id)
VALUES (1, 'Front End Developer', 98000.00, 1),
(2, 'API Developer', 98000.00, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Alex', 'Jones', 1, 1),
(2,'Junior','Gomez',1,1)
