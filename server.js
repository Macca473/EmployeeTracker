const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const sql = require('mysql');
const util = require(`util`);

var mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 5000,

  // Your username
  user: "root",

  // Your password
  password: "Ss17091997",
  database: "employeet_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

connection.query = util.promisify(connection.query);


  async function main() {
  
    let looping = true;
    while (looping) {
      const mainmenu = await inquirer.prompt([
        {
            type: 'rawlist',
            name: 'menu',
            message: `What would you like to do:`,
            choices: ['View employees', 'Add employees',`Remove employees`],
        },   
      ]);
      if (mainmenu.menu === `View employees`) {
        let res = await connection.query("SELECT employee.first_name, employee.last_name, role.name, role.salary FROM employee INNER JOIN role ON employee.role_id = role.id")
          console.table(res);
      }
      else if (mainmenu.menu === `Add employees`) {
          let rolearray = [ ];
          let res = await connection.query("SELECT name FROM role;")
            res.forEach(element => {
              rolearray.push(element.name)
            });
        // console.log("array: " + rolearray);
        let addem = await inquirer.prompt([
          {
            name: 'firstname',
            message: 'Enter Employees first name:',
          },
          {
            name: 'lastname',
            message: 'Enter Employees last name:',
          },
          {
            type: 'rawlist',
            name: 'pickrole',
            message: `What is their role?:`,
            choices: rolearray
          },   
        ]);
          let roleid = rolearray.indexOf(addem.pickrole) + 1;
          console.log(roleid);
          connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ('${addem.firstname}', '${addem.lastname}', ${roleid});`);
          console.table(`${addem.firstname}, ${addem.lastname} and id:${roleid} has been added`);
      }
      else if (mainmenu.menu === `Remove employees`) {
        let emparray = [ ];
        let empidarr = [ ];
        let fst = await connection.query("SELECT id, first_name, last_name FROM employee;");
          fst.forEach(element => {
            let flnm = element.first_name + element.last_name;
            emparray.push(flnm);
            empidarr.push(element.id);
          });
        let addem = await inquirer.prompt([
          {
            type: 'rawlist',
            name: 'pickemp',
            message: `Who will be removed?:`,
            choices: emparray
          },   
        ]);
        let empid = emparray.indexOf(addem.pickemp);
        //   console.log(empid);
          connection.query(`DELETE FROM employee WHERE (id = ${empidarr[empid]});`);
          console.table(`${addem.pickemp} has been removed`);
      }
      const confirm = await inquirer.prompt([
        {
          name: 'confirm',
          message: 'Would you like to exit?',
          type: "confirm"
        }
  
      ])
      looping = confirm.confirm;
    }
    // end of loop
    
  }

async function afterConnection() {
    await main();
    connection.end();
  };