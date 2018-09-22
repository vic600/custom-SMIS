const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productlengthchecker = (product) => {
    if (!product) {
        return false;
    } else {
        if (product.length < 4 || product.length > 10) {
            return false;
        } else {
            return true;
        }
    }
}

let validproduct = (product) => {
    if (!product) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[a-zA-Z]+$/
        );
        return regExp.test(product);
    }
}

const productvalidators = [
    {
        validator: productlengthchecker,
        message: 'product name must be more than 4 and less than 10 characters'
    },
    {
        validator: validproduct,
        message: 'product name cannot contain special characters and numbers'

    }
]

let vaidquantity = (quantity) => {
    if (!quantity) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[0-9]+$/
        );
        return regExp.test(quantity);
    }
}
const quantityvalidators = [
    {
        validator: vaidquantity,
        message: 'quatity must be a number'
    }
]
let vaidpaid = (paid) => {
    if (!paid) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[0-9]+$/
        );
        return regExp.test(paid);
    }
}
const paidvalidators = [
    {
        validator: vaidpaid,
        message: 'paid must be a number'
    }
]
const saleSchema = new Schema({
    product: { type: String, required: true, lowercase: true, validate: productvalidators },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, validate: quantityvalidators },
    paid: { type: Number, required: true, validate: paidvalidators },
    change: { type: Number, required: true },
    total: { type: Number, required: true },
    servedby: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('sales', saleSchema);