const { Pool } = require('pg');
require('dotenv').config();
const CFonts = require('cfonts');
const inquirer = require("inquirer");

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database', err.stack);
  } else {
    console.log('Connected to the database at:', res.rows[0].now);
  }
});

CFonts.say('Business Data Manager', {
  font: 'block',
  align: 'center',
  colors: ['cyan', 'magenta'],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: 0,
});

const departmentData = [
  { department_name: 'Marketing' },
  { department_name: 'HR Department' },
  { department_name: 'Business Development' },
  { department_name: 'IT Department' },
  { department_name: 'UX/UI Department' },
  { department_name: 'Accounting' },
  { department_name: 'Board of Directors' }
];

const roleData = [
  { title: 'Full Stack Developer', salary: 115000, department_id: 4 },
  { title: 'Project Manager', salary: 120000, department_id: 4 },
  { title: 'UX/UI Specialist', salary: 100000, department_id: 5 },
  { title: 'Accountant', salary: 100000, department_id: 6 },
  { title: 'CEO', salary: 200000, department_id: 3 },
  { title: 'Software Marketing Manager', salary: 100000, department_id: 1 }
];

const employeeData = [
  { first_name: 'Anthony', last_name: 'Bell', role_id: 1, manager_id: null },
  { first_name: 'Edwin', last_name: 'Rivera', role_id: 3, manager_id: null },
  { first_name: 'Lindsey', last_name: 'Clapp', role_id: 2, manager_id: null },
  { first_name: 'Maria', last_name: 'Roa', role_id: 6, manager_id: null },
  { first_name: 'Juan', last_name: 'Parra', role_id: 4, manager_id: null },
  { first_name: 'Marcio', last_name: 'Pimentel', role_id: 5, manager_id: null }
];

const startApp = async () => {
  const response = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role'
    ]
  });

  switch (response.action) {
    case 'View all departments':
      // Implement view all departments logic
      break;
    case 'View all roles':
      // Implement view all roles logic
      break;
    case 'View all employees':
      // Implement view all employees logic
      break;
    case 'Add a department':
      // Implement add a department logic
      break;
    case 'Add a role':
      // Implement add a role logic
      break;
    case 'Add an employee':
      // Implement add an employee logic
      break;
    case 'Update an employee role':
      // Implement update an employee role logic
      break;
    default:
      console.log('Invalid action');
  }
};

startApp();
