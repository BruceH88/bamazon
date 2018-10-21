// import dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");

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
  showProducts();
});

const showProducts = () => {
  const query = db.query("SELECT * FROM products", (err, products) => {
    if (err) throw err;
    products.forEach(product => {
      console.log(`${product.item_id}: ${product.product_name} costs $ ${product.price}`);
    });
    inquirer.prompt([
      {
        name: "productId",
        message: "Enter the product id you wish to purchase.",
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
        message: "Enter how many of the product you wish to purchase.",
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
      if (userResp.productId === "0") {
        db.end();
      } else {
        checkOrder(userResp.productId, userResp.quantity);
      }
    })
  });
  // logs the actual query being run
  console.log(query.sql);
};

const checkOrder = (productId, quantity) => {
  const query = db.query("SELECT * FROM products WHERE item_id = ?", [productId], (err, products) => {
    if (err) throw err;
    if (products.lenght >= 1) {
      let newQuantity = parseInt(products[0].stock_quantity) - parseInt(quantity);
      if (newQuantity >= 0) {
        updateQuantity(productId, newQuantity);
      } else {
        console.log(`Insufficient quantity!`);
        showProducts();
      }
    } else {
      console.log(`
${productId} is not a valid product. Please select an available product.
`);
      showProducts();
    }
  });
  // logs the actual query being run
  console.log(query.sql);
};

const updateQuantity = (productId, newQuantity) => {
  const query = db.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, productId], (err, response) => {
    if (err) throw err;
    console.log(response.affectedRows + " product updated!\n");
    showProducts();
  });
  // logs the actual query being run
  console.log(query.sql);
}