const { Pool } = require('pg');
require('dotenv').config();
const CFonts = require('cfonts');
const inquirer = require("inquirer");

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

pool.connect()
  .then(() => {
    console.log('Connected to the database');
    createDatabase();
  })
  .catch((err) => console.error('Error connecting to database', err));

const createDatabase = async () => {
  try {
    const createDbQuery = 'CREATE DATABASE IF NOT EXISTS BusinessDataManager_db';
    await pool.query(createDbQuery);
    console.log('Database created or already exists');
    startApp();
  } catch (err) {
    console.error('Error creating database:', err);
  }
};


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
  try {
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
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      default:
        console.log('Invalid action');
    }
  } catch (err) {
    console.error('An error occurred:', err);
  }
};

async function viewAllDepartments() {
  try {
    const query = 'SELECT * FROM departments';
    const { rows } = await pool.query(query);
    console.log('All Departments:');
    console.table(rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
  }
}

async function viewAllRoles() {
  try {
    const query = 'SELECT title, salary, department_id FROM roles';
    const { rows } = await pool.query(query);
    console.log('All Roles:');
    console.table(rows);
  } catch (err) {
    console.error('Error fetching roles:', err);
  }
}

async function viewAllEmployees() {
  try {
    const query = 'SELECT first_name, last_name, role_id, manager_id FROM employees';
    const { rows } = await pool.query(query);
    console.log('All Employees:');
    console.table(rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
  }
}

async function addDepartment() {
  try {
    const newDepartment = await inquirer.prompt({
      type: 'input',
      name: 'department_name',
      message: 'Enter the department name:'
    });

    const query = 'INSERT INTO departments (department_name) VALUES ($1) RETURNING *';
    const { rows } = await pool.query(query, [newDepartment.department_name]);
    console.log('New Department added:');
    console.table(rows);
  } catch (err) {
    console.error('Error adding department:', err);
  }
}

async function addRole() {
  try {
    const newRole = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the role title:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the role salary:'
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'Enter the department ID:'
      }
    ]);

    const query = 'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [newRole.title, newRole.salary, newRole.department_id]);
    console.log('New Role added:');
    console.table(rows);
  } catch (err) {
    console.error('Error adding role:', err);
  }
}

async function addEmployee() {
  try {
    const newEmployee = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the employee first name:'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the employee last name:'
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter the role ID:'
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Enter the manager ID (if applicable):'
      }
    ]);

    const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [newEmployee.first_name, newEmployee.last_name, newEmployee.role_id, newEmployee.manager_id]);
    console.log('New Employee added:');
    console.table(rows);
  } catch (err) {
    console.error('Error adding employee:', err);
  }
}

async function updateEmployeeRole() {
  // Implement update employee role logic
  console.log('Update employee role logic to be implemented');
}

startApp();
