// import dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const asTable = require('as-table');

// connect database
const db = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "sapwd",
  database: "bamazon_db"
});

// turn on database connection
db.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + db.threadId);
  mainPrompt();
});

const mainPrompt = () => {
  inquirer.prompt([
    {
      name: "userPick",
      message: "What would you like to do?",
      type: "list",
      choices: ["View Product Sales by Department", "Create New Department", "Exit"],
    }
  ]).then(userResp => {
    switch (userResp.userPick) {
      case "View Product Sales by Department":
        viewSales();
        break;
      case "Create New Department":
        addDepartment();
        break;
      case "Exit":
        db.end();
    }
  });
};

const viewSales = () => {
  const query = db.query("SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) as product_sales, SUM(p.product_sales) - d.over_head_costs as total_profit FROM departments d LEFT JOIN products p ON d.department_name = p.department_name GROUP BY d.department_name", (err, products) => {
    if (err) throw err;
    console.log("");
    console.log(asTable.configure({ right: true })(products));
    console.log("");
    mainPrompt();
  });
  // logs the actual query being run
  console.log(query.sql);
};

const addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "departmentID",
      message: "What is the department's id?",
    },
    {
      type: "input",
      name: "departmentName",
      message: "What is the department's name?",
    },
    {
      type: "input",
      name: "overHeadCost",
      message: "What is the over head cost?",
      default: 0,
      validate: function (price) {
        if (!isNaN(price)) {
          return true;
        } else {
          return false;
        }
      }
    },
  ]).then(newItem => {
    var query = db.query(
      "INSERT INTO departments SET ?",
      {
        department_id: newItem.departmentID,
        department_name: newItem.departmentName,
        over_head_costs: parseFloat(newItem.overHeadCost),
      },
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " department added!\n");
        mainPrompt();
      }
    );
    // logs the actual query being run
    console.log(query.sql);
  });
};
