const { Pool } = require('pg');
const { exec } = require('child_process');
require('dotenv').config();
const CFonts = require('cfonts');
const inquirer = require("inquirer");

// Initialize a connection pool to the PostgreSQL database using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
});

const startApp = async () => {
  let client;
  try {
    client = await pool.connect();

    // Check if the database is empty and insert initial data if necessary
    const departmentCount = await client.query('SELECT COUNT(*) FROM department');
    const roleCount = await client.query('SELECT COUNT(*) FROM role');
    const employeeCount = await client.query('SELECT COUNT(*) FROM employee');

    if (departmentCount.rows[0].count === '0' && roleCount.rows[0].count === '0' && employeeCount.rows[0].count === '0') {
      await new Promise((resolve, reject) => {
        exec('node insertData.js', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing insertData.js: ${stderr}`);
            reject(error);
          } else {
            console.log(stdout);
            resolve();
          }
        });
      });
    } else {
      console.log('Data already exists. Skipping data insertion.');
    }

    console.log('Connected to the employeedata_db database.');

    // Display a welcome message using CFonts
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

    // Display the main menu to the user
    await mainMenu();
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    if (client) {
      client.release();
    }
  }
};

const mainMenu = async () => {
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
        'Update an employee role',
        'Exit'
      ]
    });

    // Handle user's choice from the main menu
    switch (response.action) {
      case 'View all departments':
        await viewAllDepartments();
        break;
      case 'View all roles':
        await viewAllRoles();
        break;
      case 'View all employees':
        await viewAllEmployees();
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Exiting the application.');
        process.exit(0);
      default:
        console.log('Invalid action');
    }
  } catch (err) {
    console.error('An error occurred:', err);
  }
};

const returnToMainMenu = async () => {
  const { returnToMenu } = await inquirer.prompt({
    type: 'list',
    name: 'returnToMenu',
    message: 'What would you like to do next?',
    choices: ['Return to Main Menu', 'Exit']
  });

  if (returnToMenu === 'Return to Main Menu') {
    await mainMenu();
  } else {
    console.log('Exiting the application.');
    process.exit(0);
  }
};

async function viewAllDepartments() {
  try {
    const query = 'SELECT * FROM department';
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      console.log('No departments found.');
    } else {
      console.log('All Departments:');
      console.table(rows);
    }
  } catch (err) {
    console.error('Error fetching departments:', err);
  } finally {
    await returnToMainMenu();
  }
}

async function viewAllRoles() {
  try {
    const query = 'SELECT title, salary, department_id FROM role';
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      console.log('No roles found.');
    } else {
      console.log('All Roles:');
      console.table(rows);
    }
  } catch (err) {
    console.error('Error fetching roles:', err);
  } finally {
    await returnToMainMenu();
  }
}

async function viewAllEmployees() {
  try {
    const query = 'SELECT first_name, last_name, role_id, manager_id FROM employee';
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      console.log('No employees found.');
    } else {
      console.log('All Employees:');
      console.table(rows);
    }
  } catch (err) {
    console.error('Error fetching employees:', err);
  } finally {
    await returnToMainMenu();
  }
}

async function addDepartment() {
  try {
    const newDepartment = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the department name:'
    });

    const query = 'INSERT INTO department (name) VALUES ($1) RETURNING *';
    const { rows } = await pool.query(query, [newDepartment.name]);
    console.log('New Department added:');
    console.table(rows);
  } catch (err) {
    console.error('Error adding department:', err);
  } finally {
    await returnToMainMenu();
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

    const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [newRole.title, newRole.salary, newRole.department_id]);
    console.log('New Role added:');
    console.table(rows);
  } catch (err) {
    console.error('Error adding role:', err);
  } finally {
    await returnToMainMenu();
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

    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await pool.query(query, [newEmployee.first_name, newEmployee.last_name, newEmployee.role_id, newEmployee.manager_id]);
    console.log('New Employee added:');
    console.table(rows);
  } catch (err) {
    console.error('Error adding employee:', err);
  } finally {
    await returnToMainMenu();
  }
}

async function updateEmployeeRole() {
  try {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id
    }));

    const roles = await pool.query('SELECT id, title FROM role');
    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id
    }));

    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employeeChoices
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the new role:',
        choices: roleChoices
      }
    ]);

    const query = 'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [roleId, employeeId]);
    if (rows.length === 0) {
      console.log('No employee found with the given ID.');
    } else {
      console.log('Employee role updated:');
      console.table(rows);
    }
  } catch (err) {
    console.error('Error updating employee role:', err);
  } finally {
    await returnToMainMenu();
  }
}

// Start the application
startApp();
