const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let titlelengthchecker = (title) => {
    if (!title) {
        return false;
    } else {
        if (title.length < 4 || title.length > 20) {
            return false;
        } else {
            return true;
        }
    }
}

let validtitle = (title) => {
    if (!title) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[A-Z]+$/
        );
        return regExp.test(title);
    }
}
const titlevalidators = [
    {
        validator: titlelengthchecker,
        message: 'title must be more than 4 characters and less than 20 characters'
    },
    {
        validator: validtitle,
        message: 'uppercase characters only'
    }
]

let mottolengthchecker = (motto) => {
    if (!motto) {
        return false;
    } else {
        if (motto.length < 4 || motto.length > 20) {
            return false;
        } else {
            return true;
        }
    }
}

let validmotto = (motto) => {
    if (!motto) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[a-z]+$/
        );
        return regExp.test(motto);
    }
}

const mottovalidators = [
    {
        validator: mottolengthchecker,
        message: 'school motto must be more than 4 characters but less than 20'
    },
    {
        validator: validmotto,
        message: 'characters only'
    }
]

let validaddress = (address) => {
    if (!address) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[a-zA-Z0-9]+$/
        );
        return regExp.test(address);
    }
}
const addressvalidators = [{
    validator: validaddress,
    message: 'characters and numbers only'
}]

let vaidphone = (phone) => {
    if (!phone) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[0-9]+$/
        );
        return regExp.test(phone);
    }
}

const phonevalidators = [
    {
        validator: vaidphone,
        message: 'numbers only'
    }
]

let validemail = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        return regExp.test(email);
    }
}

const emailvalidator = [{
    validator: validemail,
    message: 'provide a valid email'
}]
const generalSchema = new Schema({

    title: { type: String, required: true, unique: true, uppercase: true, validate: titlevalidators },
    motto: { type: String, required: true, unique: true, lowercase: true, validate: mottovalidators },
    address: { type: String, required: true, unique: true, lowercase: true, validate: addressvalidators },
    phone: { type: Number, required: true, unique: true, validate: phonevalidators },
    email: { type: String, required: true, unique: true, validate: emailvalidator }
});

module.exports = mongoose.model('general', generalSchema);