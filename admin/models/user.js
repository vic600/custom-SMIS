const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let emaillengthchecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 8 || email.length > 30) {
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

const emailvalidators = [
    {
        validator: emaillengthchecker,
        message: 'email must contain more than 8 and less than 30 characters'
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

let validusername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(
            /^[a-zA-Z0-9]+$/
        );
        return regExp.test(username);
    }
}

const usernamevalidators = [
    {
        validator: usernamelengthchecker,
        message: 'username must be more than 4 characters and less than 20'
    },
    {
        validator: validusername,
        message: 'username cannot have special characters'
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
        message: 'password must be more than 8 and less than 35 characters'
    },
    {
        validator: validpassword,
        message: 'password must have letter,number,uppercase,lowercase and special characters'
    }
]
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailvalidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernamevalidators },
    password: { type: String, required: true, validate: passwordvalidators }
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparepassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User', userSchema);