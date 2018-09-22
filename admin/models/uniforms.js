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

let vaidprice = (price) => {
    if (!price) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[0-9]+$/
        );
        return regExp.test(price);
    }
}
const pricevalidators = [
    {
        validator: vaidprice,
        message: 'price must be a number'
    }
]
let vaidstock = (stock) => {
    if (!stock) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[0-9]+$/
        );
        return regExp.test(stock);
    }
}
const stockvalidators = [
    {
        validator: vaidstock,
        message: 'stock must be a number'
    }
]
const uniformSchema = new Schema({
    product: { type: String, required: true, unique: true, lowecase: true, validate: productvalidators },
    price: { type: Number, required: true, validate: pricevalidators },
    stock: { type: Number, required: true, validate: stockvalidators }
});

module.exports = mongoose.model('uniforms', uniformSchema);