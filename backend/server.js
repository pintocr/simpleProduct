const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose  = require('mongoose');

const app = express();
const productRoutes = express.Router();
const PORT = 8080;

let Product = require('./models/product');
let User = require('./models/user');

app.use(cors());

app.use(bodyParser.json());



mongoose.connect('mongodb://127.0.0.1:27017/products', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

productRoutes.route('/').get(function (req, res){
    console.log('got a get request for the start page');
    Product.find(function (err, products){
        if(products){
            res.json(products);
        } else {
            console.log('ERROR: ', err);
        }
    });
});


productRoutes.route('/add').post(function (req, res) {
    console.log("Reqest to save this product:" + JSON.stringify(req.body));
    let product = new Product(req.body);
    console.log(product);
    product.save()
        .then(product => {
            res.status(200).json({ 'product': 'product added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new product failed');
        });
});


productRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Product.findById(id, function (err, product) {
        res.json(product);
    });
});

productRoutes.route('/update/:id').post(function (req, res) {
    console.log("Request to update this product:" + JSON.stringify(req.body));
    Product.findById(req.params.id, function (err, product) {
        if (!product) res.status(404).send("product to update not found, product _id:" + req.params.id);
        else {
            product.product_id = req.body.product_id;
            product.product_name = req.body.product_name;
            product.product_value = req.body.product_value;
            product.product_amount = req.body.product_amount;
            product.product_totalPrice = req.body.product_totalPrice;

            product.save().then(product => {
                res.json('product updated!');
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        }
    });
});

productRoutes.route('/delete/:id').get(function (req, res) {
    Product.deleteOne({ "_id": req.params.id }, function (err, product) {
        if (!product)
            res.status(404).send("data is not found");
        else
            res.json('product deleted!');
    });
});


productRoutes.route('/login').post(function (req, res) {
    User.findOne({"user_name": req.body.username}).then(response => {
       if(req.body.password == response.user_password){
           res.status(200).send("valid password");
       } else {
        res.status(418).send("not a valid password");
       }
    })
    .catch(err => console.log(err));
});


app.use('/', productRoutes);

app.listen(PORT, function () {
    console.log("Server should be running on Port: " + PORT);
});