const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let studentlengthchecker = (student) => {
    if (!student) {
        return false;
    } else {
        if (student.length < 4 || student.length > 20) {
            return false;
        } else {
            return true;
        }
    }
}

let validstudent = (student) => {
    if (!student) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[a-zA-Z]+$/
        );
        return regExp.test(student);
    }
}

const studentvalidators = [
    {
        validator: studentlengthchecker,
        message: 'student name must be more than 4 and less than 20 characters'
    },
    {
        validator: validstudent,
        message: 'characters only'
    }
]

let validamount = (amount) => {
    if (!amount) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[0-9]+$/
        );
        return regExp.test(amount);
    }
}

const amountvalidators = [
    {
        validator: validamount,
        message: 'provide a valid amount'
    }
]
const paymentSchema = new Schema({
    student: { type: String, required: true, lowercase: true, validate: studentvalidators },
    food: { type: String, required: true, lowercase: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true, validate: amountvalidators },
    balance: { type: Number, required: true },
    servedby: { type: String, required: true, lowercase: true },
    date: { type: Date, default: Date.now }

});

module.exports = mongoose.model('pay', paymentSchema);