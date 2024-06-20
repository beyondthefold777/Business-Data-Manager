INSERT INTO department (department_name)
VALUES ("Marketing"),
       ("HR Department"),
       ("Business Development"),
       ("IT Department"),
       ("UX/UI Department"),
       ("Accounting"),
       ("Board of Directors");

INSERT INTO role (title, salary, department_id)
VALUES ("Full Stack Developer", 115000, IT)
    ("Project Manager", 120000, IT)
    ("UX/UI Specialist", 100000, UI/UX)
    ("Accountant", 100000, ACCT)
    ("CEO", 200000, BD)
    ("Software Marketing Manager", 100000, MKT)


INSERT INTO employee (first_name, last_name, manager_id)
VALUES ("anthony", "bell", Full Stack Developer), 
       ("edwin", "rivera", UX/UX Specialist),
        ("lindsey", "clapp", Project Manager),
         ("maria", "roa", Software marketing manager),
          ("juan", "parra", Accountant),
          ("marcio", "pimentel", CEO);