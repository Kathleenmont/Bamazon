var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "yourRootPassword",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);

});

var viewProducts = function () {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity + "\n");
        }
    });
}

var viewLowInventory = function () {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 35) {
                console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity + "\n");
            }
        }

    });
}

var start = function () {

    inquirer.prompt({
        name: "choice",
        type: "list",
        Message: "What would you like to do? \n",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function (answer) {
        if (answer.choice === "View Products for Sale") {
            viewProducts();
            console.log("View Products for Sale")
        } else if (answer.choice === "View Low Inventory") {
            viewLowInventory();
            console.log("View Low Inventory")
        } else if (answer.choice === "Add to Inventory") {
            // addToInventory();
            console.log("Add to Inventory")
        } else if (answer.choice === "Add New Product") {
            // addNewProduct();
            console.log("Add New Product")
        }
    })

}

start();