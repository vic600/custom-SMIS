const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
let emailengthchecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 4 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
}

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
const emailvaidators = [
    {
        validator: emailengthchecker,
        message: 'email must bemore than 4 but less than 20 characters'
    },
    {
        validator: validemail,
        message: 'provide a valid email'
    }
]

let usernamelengthchecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 4 || username.length > 20) {
            return false;
        } else {
            return true;
        }
    }
}

let vaidusername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[a-zA-Z0-9]+$/
        );
        return regExp.test(username);
    }

}

const usernamevaidators = [
    {
        validator: usernamelengthchecker,
        message: 'username must be greater than 4 but less than 20'
    },
    {
        validator: vaidusername,
        message: 'username cannot contain special characters'
    }
]

let passwordlengthchecker = (password) => {
    if (!password) {
        return false;
    } else {
        if (password.length < 8 || password.length > 35) {
            return false;
        } else {
            return true;
        }
    }
}

let validpassword = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(
            /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/
        );
        return regExp.test(password);
    }
}

const passwordvalidators = [
    {
        validator: passwordlengthchecker,
        message: 'password cannot be less than 8 and greater than 35'
    },
    {
        validator: validpassword,
        message: 'password must have capital,small,numbers and special characters'
    }
]
const adminSchema = new Schema({
    email: { type: String, unique: true, required: true, validate: emailvaidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernamevaidators },
    password: { type: String, required: true, validate: passwordvalidators },
    resetoken: { type: String, required: false }
});

adminSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });

});
adminSchema.methods.comparepassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('admin', adminSchema);