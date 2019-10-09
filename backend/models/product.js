const mongoose = require('mongoose');

//const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({

    product_name: {
        type: String
    },
    product_value: {
        type: Number
    },
    product_amount:{
        type: Number
    },
    product_totalPrice: {
        type: Number
    }
});


module.exports = mongoose.model('Product', Product);


