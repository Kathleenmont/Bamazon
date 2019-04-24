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






connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + "\n")
    }
    inquirer.prompt([{
        name: "id",
        message: "what is the ID number of the product you would like to buy? \n",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "howMany",
        message: "How may of this item would you like to buy? \n",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function (answer) {

        for (var i = 0; i < res.length; i++) {
          
            if (res[i].item_id == parseInt(answer.id)) {
                var chosenItem = res[i];
                if (chosenItem === false) {
                    console.log("Choose a valad ID number")
                }
                console.log(chosenItem)
                if (chosenItem.stock_quantity >= parseInt(answer.howMany)) {
                    console.log("Your order total is " + chosenItem.price * answer.howMany)
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: chosenItem.stock_quantity - parseInt(answer.howMany)
                    }, {
                        item_id: chosenItem.item_id
                    }], function (err, res) {
                        console.log("your purches was succesful");
                    })
                } else {
                        console.log("We don't have enough of the item to fulfill your order. Try again with a smaller quantitity \n")
                        
                }
            }
        }
    })

})



