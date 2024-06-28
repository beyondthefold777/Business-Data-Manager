const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});


const insertData = async () => {
  try {
    await pool.query('BEGIN');

    await pool.query(`
      INSERT INTO department (name)
      VALUES ('Marketing'),
             ('HR Department'),
             ('Business Development'),
             ('IT Department'),
             ('UX UI Department'),
             ('Accounting'),
             ('Board of Directors')
    `);

    await pool.query(`
      INSERT INTO role (title, salary, department_id)
      VALUES ('Full Stack Developer', 115000, 4),
             ('Project Manager', 120000, 4),
             ('UX UI Specialist', 100000, 5),
             ('Accountant', 100000, 6),
             ('CEO', 200000, 3),
             ('Software Marketing Manager', 100000, 1)
    `);

    await pool.query(`
      INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES ('anthony', 'bell', 1, 2),
             ('edwin', 'rivera', 3, NULL),
             ('lindsey', 'clapp', 2, 1),
             ('maria', 'roa', 6, 5),
             ('juan', 'parra', 4, NULL),
             ('marcio', 'pimentel', 5, NULL)
    `);

    await pool.query('COMMIT');
    console.log('Data insertion complete.');
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error inserting data:', err);
  } finally {
    pool.end();
  }
};

insertData();
