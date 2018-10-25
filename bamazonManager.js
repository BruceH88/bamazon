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

// define variables
const departmentList = ["Appliances", "Computers", "Electronics", "Furniture", "Health & Fitness", "Household", "Tools"];

// define functions
const mainPrompt = () => {
  inquirer.prompt([
    {
      name: "userPick",
      message: "What would you like to do?",
      type: "list",
      choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
      default: "Songs by artist"
    }
  ]).then(userResp => {
    switch (userResp.userPick) {
      case "View Products":
        viewProducts();
        break;
      case "View Low Inventory":
        lowInventory();
        break;
      case "Add to Inventory":
        addInventory();
        break;
      case "Add New Product":
        addProduct();
        break;
      case "Exit":
        db.end();
    }
  });
};

const viewProducts = () => {
  const query = db.query("SELECT item_id, product_name, price, stock_quantity FROM products", (err, products) => {
    if (err) throw err;
    console.log("");
    console.log(asTable.configure({ right: true })(products));
    console.log("");
    mainPrompt();
  });
  // logs the actual query being run
  console.log(query.sql);
};

const lowInventory = () => {
  const query = db.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", (err, products) => {
    if (err) throw err;
    console.log("");
    console.log(asTable.configure({ right: true })(products));
    console.log("");
    mainPrompt();
  });
  // logs the actual query being run
  console.log(query.sql);
};

const addInventory = () => {
  const query = db.query("SELECT item_id, product_name, price, stock_quantity FROM products", (err, products) => {
    if (err) throw err;
    console.log("\n" + asTable.configure({ right: true })(products) + "\n");
    inquirer.prompt([
      {
        name: "productId",
        message: "Enter the item id to add inventory:",
        type: "input",
        validate: function (productId) {
          if (!isNaN(productId)) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        name: "quantity",
        message: "Enter how much intentory are you adding:",
        type: "input",
        validate: function (quantity) {
          if (!isNaN(quantity)) {
            if (quantity > 0) {
              return true;
            } else {
              console.log("Enter a quantity greater than zero.");
              return false;
            }
          } else {
            return false;
          }
        }
      }
    ]).then(userResp => {
      updateInventory(userResp.productId, userResp.quantity);
    })
  });
  // logs the actual query being run
  // console.log(query.sql);
};

const updateInventory = (productId, quantity) => {
  const query = db.query("SELECT * FROM products WHERE item_id = ?", [productId], (err, products) => {
    if (err) throw err;
    // console.log(products[0]);
    if (products[0] === undefined) {
      console.log(`
${productId} is no longer available. Add product if needed.
`);
      mainPrompt();
    } else {
      let newQuantity = parseInt(products[0].stock_quantity) + parseInt(quantity);
      updateQuantity(productId, newQuantity);
    }
  });
  // logs the actual query being run
  // console.log(query.sql);
};

const updateQuantity = (productId, newQuantity) => {
  const query = db.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, productId], (err, response) => {
    if (err) throw err;
    console.log(`
${response.affectedRows} stock_quantity update.
`);
    mainPrompt();
  });
  // logs the actual query being run
  console.log(query.sql);
}

const addProduct = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "itemID",
      message: "What is the product's id?",
    },
    {
      type: "input",
      name: "productName",
      message: "What is the product's name?",
    },
    {
      type: "list",
      name: "department",
      message: "What department is this for?",
      choices: departmentList
    },
    {
      type: "input",
      name: "price",
      message: "What is the price per unit?",
      default: 0,
      validate: function (price) {
        if (!isNaN(price)) {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "quantity",
      message: "How many do you have in stock?",
      default: 0,
      validate: function (quantity) {
        if (!isNaN(quantity)) {
          return true;
        } else {
          return false;
        }
      }
    }
  ]).then(newItem => {
    var query = db.query(
      "INSERT INTO products SET ?",
      {
        item_id: newItem.itemID,
        product_name: newItem.productName,
        department_name: newItem.department,
        price: parseFloat(newItem.price),
        stock_quantity: parseInt(newItem.quantity)
      },
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " product added!\n");
        mainPrompt();
      }
    );
    // logs the actual query being run
    console.log(query.sql);
  });
};
