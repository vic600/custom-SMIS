const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let foodengthchecker = (food) => {
    if (!food) {
        return false;
    } else {
        if (food.length < 4 || food.length > 10) {
            return false;
        } else {
            return true;
        }
    }
}

let validfood = (food) => {
    if (!food) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[a-zA-Z]+$/
        );
        return regExp.test(food);
    }
}

const foodvalidators = [
    {
        validator: foodengthchecker,
        message: 'food name must be more than 4 and less than 10 characters'
    },
    {
        validator: validfood,
        message: 'food name can only be characters only'
    }
]

let validprice = (price) => {
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
        validator: validprice,
        message: 'price must be a number'
    }
]
const menuSchema = new Schema({
    food: { type: String, required: true, unique: true, lowercase: true, validate: foodvalidators },
    price: { type: Number, required: true, validate: pricevalidators }
});

module.exports = mongoose.model('meal', menuSchema);