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
  

});

var viewProducts = function () {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity + "\n");
            
        }
        start();
    });
}

var viewLowInventory = function () {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                var isLow = true;
                console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity + "\n");
            
            }
        }
        if (isLow === undefined) {
            console.log("\n No low inventory at this time.\n")
        }
        
        start();

    });
}

var addToInventory = function () {

    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity + "\n")
        }
        inquirer.prompt([{
            name: "id",
            message: "Enter the ID number of the product you are adding inventory to. \n",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "howMany",
            message: "Enter number of inventory you are adding. \n",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (answer) {
            for (var i = 0; i < res.length; i++) {

                if (res[i].item_id === parseInt(answer.id)) {
                    var itemToAdd = res[i];

                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: itemToAdd.stock_quantity + parseInt(answer.howMany)
                    }, {
                        item_id: itemToAdd.item_id
                    }], function (err, res) {
                        console.log("\n Items successfully added to inventory \n");
                        start();
                    })
                }
            }
            if (itemToAdd === undefined) {
                console.log("\n Choose a valad ID number \n")
                start();
            }

        })

    })
}

var addNewProduct = function () {
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "Enter product name"
    }, {
        name: "department",
        type: "input",
        message: "Enter department name"
    }, {
        name: "price",
        type: "input", 
        message: "Enter product price"
    }, {
        name: "quantity", 
        type: "input",
        message: "Enter product quantity"
    }]).then(function (answer) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.product,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
        }, function (err, res) {
            console.log("\n The new product updated into the system \n")
            start();
        })
    })
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
            
        } else if (answer.choice === "View Low Inventory") {
            viewLowInventory();
           
        } else if (answer.choice === "Add to Inventory") {
            addToInventory();
           
        } else if (answer.choice === "Add New Product") {
            addNewProduct();
        }
    })

}

start();