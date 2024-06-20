INSERT INTO department (department_name)
VALUES ('Marketing'),
       ('HR Department'),
       ('Business Development'),
       ('IT Department'),
       ('UX/UI Department'),
       ('Accounting'),
       ('Board of Directors');

INSERT INTO role (title, salary, department_id)
VALUES ('Full Stack Developer', 115000, 4),
       ('Project Manager', 120000, 4),
       ('UX/UI Specialist', 100000, 5),
       ('Accountant', 100000, 6),
       ('CEO', 200000, 3),
       ('Software Marketing Manager', 100000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('anthony', 'bell', 1, 2),
       ('edwin', 'rivera', 3, NULL),
       ('lindsey', 'clapp', 2, 1),
       ('maria', 'roa', 6, 5),
       ('juan', 'parra', 4, NULL),
       ('marcio', 'pimentel', 5, NULL);
