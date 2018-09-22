const config = require('../config/database');
const admin = require('../models/admin');
const User = require('../models/user');
const uniforms = require('../models/uniforms');
const meal = require('../models/menu');
const sales = require('../models/sales');
const pay = require('../models/payments');
const general = require('../models/general');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
module.exports = (router) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'zikoworld600@gmail.com', // generated ethereal user
            pass: 'nuski300' // generated ethereal password
        }
    });
    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'email is required' });
        } else {
            if (!req.body.username) {
                res.json({ success: false, message: 'username is required' });
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: 'password is required' });
                } else {
                    let user = new admin({
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password
                    });
                    user.save((err) => {
                        if (err) {
                            if (err.code === 11000) {
                                res.json({ success: false, message: 'admin exists' });
                            } else {
                                if (err.errors) {
                                    if (err.errors.email) {
                                        res.json({ success: false, message: err.errors.email.message });
                                    } else {
                                        if (err.errors.username) {
                                            res.json({ success: false, message: err.errors.username.message });
                                        } else {
                                            if (err.errors.password) {
                                                res.json({ success: false, message: err.errors.password.message });
                                            } else {
                                                res.json({ success: false, message: 'failed to save admin ' + err });
                                            }
                                        }
                                    }
                                } else {
                                    res.json({ success: false, message: err });
                                }
                            }

                        } else {
                            res.json({ success: true, message: 'admin added' });
                        }
                    });
                }
            }
        }

    });
    router.post('/login', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'email is required' });
        } else {
            admin.findOne({ email: req.body.email }, (err, suser) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!suser) {
                        res.json({ success: false, message: 'admin not found' });
                    } else {
                        if (!req.body.password) {
                            res.json({ success: false, message: 'password is required' });
                        } else {
                            const validpassword = suser.comparepassword(req.body.password);
                            if (!validpassword) {
                                res.json({ success: false, message: 'invalid password' });
                            } else {
                                const token = jwt.sign({ userId: suser._id }, config.secret, { expiresIn: '1h' });
                                res.json({ success: true, message: 'welcome', token: token, admin: { admin: suser.username } });
                            }
                        }
                    }
                }
            });
        }
    });

    router.put('/resetpassword', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'email is required' });
        } else {
            admin.findOne({ email: req.body.email }).select('email username resetoken').exec((err, suser) => {
                if (err) {
                    ree.json({ success: false, message: err });
                } else {
                    if (!suser) {
                        res.json({ success: false, message: 'user not found' });
                    } else {
                        suser.resetoken = jwt.sign({ semail: suser.email }, config.secret, { expiresIn: '1h' });
                        suser.save((err) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                // setup email data with unicode symbols
                                let mailOptions = {
                                    from: 'SMIS', // sender address
                                    to: suser.email, // list of receivers
                                    subject: 'password reset', // Subject line
                                    text: 'Hello' + suser.username + 'click on the link to reset your password:<br></br><a href="http://localhost:4200/reset/' + suser.resetoken + '"></a>', // plain text body
                                    html: 'Hello <strong>' + suser.username + '</strong><br></br>click the link to reset your password <a href="http://localhost:4200/reset/' + suser.resetoken + '">reset</a>' // html body
                                };

                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent: %s', info.messageId);
                                    res.json({ success: true, message: 'please check your email for reset link' });
                                    // Preview only available when sending through an Ethereal account
                                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                                });

                            }
                        });
                    }
                }
            });
        }
    });

    router.get('/resetpassword/:token', (req, res) => {
        if (!req.params.token) {
            res.json({ success: false, message: 'reset token was not provided' });
        } else {
            admin.findOne({ resetoken: req.params.token }, (err, suser) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!suser) {
                        res.json({ success: false, message: 'token was not found' });
                    } else {
                        var token = req.params.token;
                        jwt.verify(token, config.secret, (err, decoded) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                if (!decoded) {
                                    res.json({ success: false, message: 'invalid token' });
                                } else {
                                    res.json({ success: true, message: "set new password", suser: suser._id });
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    router.put('/savepassword', (req, res) => {
        if (!req.body.password) {
            res.json({ success: false, message: 'password is required' });
        } else {
            admin.findOne({ _id: req.body.id }).select().exec((err, suser) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!suser) {
                        res.json({ success: false, message: 'nothing found' });
                    } else {
                        suser.password = req.body.password;
                        suser.token = false;
                        suser.save((err) => {
                            if (err) {
                                if (err.errors) {
                                    if (err.errors.password) {
                                        res.json({ success: false, message: err.errors.password.message });
                                    } else {
                                        res.json({ success: false, message: 'could not save password' + err });
                                    }
                                } else {
                                    res.json({ success: false, message: err });
                                }

                            } else {
                                res.json({ success: true, message: 'password was reset' });
                            }
                        });
                    }
                }
            });
        }
    });
    //---------------------------------------------------------------------middleware--------------------------------------------------------//
    router.use((req, res, next) => {
        var token = req.headers['authorization'];
        if (!token) {
            res.json({ success: false, message: 'no token was provided' });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: '' + err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });
    //---------------------------------------------------------------------middleware--------------------------------------------------------//
    //users
    router.get('/profile', (req, res) => {
        admin.findOne({ _id: req.decoded.userId }).select("email username").exec((err, admin) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!admin) {
                    res.json({ success: false, message: 'profile not found' });
                } else {
                    res.json({ success: true, message: 'profile loaded', profile: admin });
                }

            }
        });
    });
    router.post('/adduser', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'email is required' });
        } else {
            if (!req.body.username) {
                res.json({ success: false, message: 'username is required' });
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: 'password is required' });
                } else {
                    let user = new User({
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password
                    });
                    user.save((err) => {
                        if (err) {
                            if (err.code === 11000) {
                                res.json({ success: false, message: 'user exists' });
                            } else {
                                if (err.errors) {
                                    if (err.errors.email) {
                                        res.json({ success: false, message: err.errors.email.message });
                                    } else {
                                        if (err.errors.username) {
                                            res.json({ success: false, message: err.errors.username.message });
                                        } else {
                                            if (err.errors.password) {
                                                res.json({ success: false, message: err.errors.password.message });
                                            } else {
                                                res.json({ success: false, message: 'failed to save user ' + err });
                                            }
                                        }
                                    }
                                } else {
                                    res.json({ success: false, message: err });
                                }
                            }

                        } else {
                            res.json({ success: true, message: 'user added' });
                        }
                    });
                }
            }
        }

    });

    router.get('/allusers', (req, res) => {
        User.find({}, (err, users) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!users) {
                    res.json({ success: false, message: 'no user was found' });
                } else {
                    res.json({ success: true, message: 'Users loaded', users: users });
                }
            }
        });
    });

    router.get('/user/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'user id required' });
        } else {
            User.find({ _id: req.params.id }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'no user was found' });
                    } else {
                        res.json({ success: true, message: 'user found', user: user });
                    }
                }
            });
        }
    });
    router.delete('/deleteuser/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'user id is required' });
        } else {
            User.findOne({ _id: req.params.id }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'no user was found' });
                    } else {
                        user.remove((err) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                res.json({ success: true, message: 'user deleted successfully' });
                            }
                        });
                    }
                }
            });
        }
    });
    //kits
    router.post('/adduniform', (req, res) => {
        if (!req.body.product) {
            res.json({ success: false, message: 'product name must be provided' });
        } else {
            if (!req.body.price) {
                res.json({ success: false, message: 'price must be provided' });
            } else {
                if (!req.body.stock) {
                    res.json({ success: false, message: 'produt stock must be provided' });
                } else {
                    let uniform = new uniforms({
                        product: req.body.product,
                        price: req.body.price,
                        stock: req.body.stock
                    });
                    uniform.save((err) => {
                        if (err) {
                            if (err.code === 11000) {
                                res.json({ success: false, message: 'uniform already exists' });
                            } else {
                                if (err.errors) {
                                    if (err.errors.product) {
                                        res.json({ success: false, message: err.errors.product.message });
                                    } else {
                                        if (err.errors.price) {
                                            res.json({ success: false, message: err.errors.price.message });
                                        } else {
                                            if (err.errors.stock) {
                                                res.json({ success: false, message: err.errors.stock.message });
                                            } else {
                                                res.json({ success: false, message: 'failed to add uniform' + err });
                                            }
                                        }
                                    }
                                } else {
                                    res.json({ success: false, message: err });
                                }
                            }

                        } else {
                            res.json({ success: true, message: 'uniform added' })
                        }
                    });
                }
            }
        }
    });

    router.get('/alluniforms', (req, res) => {
        uniforms.find({}, (err, uniforms) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!uniforms) {
                    res.json({ success: false, message: 'no uniforms were found' });
                } else {
                    res.json({ success: true, message: 'stock was loaded', uniforms: uniforms });
                }
            }
        });
    });

    router.get('/uniform/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'uniform id required' });
        } else {
            uniforms.findOne({ _id: req.params.id }, (err, uniform) => {
                if (err) {
                    res.json({ success: false, message: err.message });
                } else {
                    if (!uniform) {
                        res.json({ success: false, message: 'uniform not found' });
                    } else {
                        res.json({ success: true, message: 'uniform loaded', uniform: uniform });
                    }
                }
            });
        }
    });

    router.put('/edituniform', (req, res) => {
        if (!req.body._id) {
            res.json({ success: false, message: 'uniform id required' });
        } else {
            uniforms.findOne({ _id: req.body._id }, (err, uniform) => {
                if (err) {
                    res.json({ success: false, message: err.message });
                } else {
                    if (!uniform) {
                        res.json({ success: false, message: 'no uniform found' });
                    } else {
                        if (!req.body.product) {
                            res.json({ success: false, message: 'product name is required' });
                        } else {
                            if (!req.body.price) {
                                res.json({ success: false, message: 'product price is required' });
                            } else {
                                if (!req.body.stock) {
                                    res.json({ success: false, message: 'product stock is required' });
                                } else {
                                    uniform.product = req.body.product;
                                    uniform.price = req.body.price;
                                    uniform.stock = req.body.stock;

                                    uniform.save((err) => {
                                        if (err) {
                                            if (err.errors) {
                                                if (err.errors.product) {
                                                    res.json({ success: false, message: err.errors.product.message });
                                                } else {
                                                    if (err.errors.price) {
                                                        res.json({ success: false, message: err.errors.price.message });
                                                    } else {
                                                        if (err.errors.stock) {
                                                            res.json({ success: false, message: err.errors.stock.message });
                                                        } else {
                                                            res.json({ success: false, message: 'failed to edit uniform' + err });
                                                        }
                                                    }
                                                }
                                            } else {
                                                res.json({ success: false, message: err });
                                            }

                                        } else {
                                            res.json({ success: true, message: 'uniform edited successfuly' });
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
    });

    router.delete('/deleteuni/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'uniform id required' });
        } else {
            uniforms.findOne({ _id: req.params.id }, (err, uni) => {
                if (err) {
                    res.json({ success: false, message: err.message });
                } else {
                    if (!uni) {
                        res.json({ success: false, message: 'no uniform found' });
                    } else {
                        uni.remove((err) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                res.json({ success: true, message: 'uniform deleted successfully' });
                            }
                        });
                    }
                }
            });
        }
    });


    router.post('/addmeal', (req, res) => {
        if (!req.body.food) {
            res.json({ success: false, message: 'Name of food is required' });
        } else {
            if (!req.body.price) {
                res.json({ success: false, message: 'price of food is required' });
            } else {
                let menu = new meal({
                    food: req.body.food,
                    price: req.body.price
                });
                menu.save((err) => {
                    if (err) {
                        if (err.code === 11000) {
                            res.json({ success: false, message: 'meal already exists' });
                        } else {
                            if (err.errors) {
                                if (err.errors.food) {
                                    res.json({ success: false, message: err.errors.food.message });
                                } else {
                                    if (err.errors.price) {
                                        res.json({ success: false, message: err.errors.price.message });
                                    } else {
                                        res.json({ success: false, message: 'meal was not added' + err });
                                    }
                                }
                            } else {
                                res.json({ success: false, message: err });
                            }
                        }

                    } else {
                        res.json({ success: true, message: 'meal added' });
                    }
                });
            }
        }
    });

    router.get('/menu', (req, res) => {
        meal.find({}, (err, menu) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!menu) {
                    res.json({ success: false, message: 'no food on the menu' });
                } else {
                    res.json({ success: true, message: 'Menu loaded', menu: menu });
                }
            }
        });
    });

    router.get('/meal/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'no meal id provided' });
        } else {
            meal.findOne({ _id: req.params.id }, (err, food) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!food) {
                        res.json({ success: false, message: 'meal was not found' });
                    } else {
                        res.json({ success: true, message: 'meal was loaded', food: food });
                    }
                }
            });
        }
    });

    router.put('/editmenu', (req, res) => {
        if (!req.body._id) {
            res.json({ success: false, message: 'meal id is required' });
        } else {
            meal.findOne({ _id: req.body._id }, (err, dish) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!dish) {
                        res.json({ success: false, message: 'no meal found' });
                    } else {
                        if (!req.body.food) {
                            res.json({ success: false, message: 'meal name must be provided' });
                        } else {
                            if (!req.body.price) {
                                res.json({ success: false, message: 'meal price is required' });
                            } else {
                                dish.food = req.body.food;
                                dish.price = req.body.price;
                                dish.save((err) => {
                                    if (err) {
                                        if (err.errors) {
                                            if (err.errors.food) {
                                                res.json({ success: false, message: err.errors.food.message });
                                            } else {
                                                if (err.errors.price) {
                                                    res.json({ success: false, message: err.errors.price.message });
                                                } else {
                                                    res.json({ success: false, message: 'failed to save meal' + err });
                                                }
                                            }
                                        } else {
                                            res.json({ success: false, message: err.message });
                                        }

                                    } else {
                                        res.json({ success: true, message: 'meal edited successfully' });
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    });

    router.delete('/deletemeal/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'meal  id is required' });
        } else {
            meal.findOne({ _id: req.params.id }, (err, food) => {
                if (err) {
                    res.json({ success: false, message: err.message });
                } else {
                    if (!food) {
                        res.json({ success: false, message: 'no meal was found' });
                    } else {
                        food.remove((err) => {
                            if (err) {
                                res.json({ success: false, message: err.message });
                            } else {
                                res.json({ success: true, message: 'meal deleted successfully' });
                            }
                        });
                    }
                }
            });
        }
    });

    router.post('/addinfo', (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'school name is required' });
        } else {
            if (!req.body.motto) {
                res.json({ success: false, message: 'Add school motto' });
            } else {
                if (!req.body.address) {
                    res.json({ success: false, message: 'Add location please' });
                } else {
                    if (!req.body.phone) {
                        res.json({ success: false, message: 'Add phone number' });
                    } else {
                        if (!req.body.email) {
                            res.json({ success: false, message: 'provide a school email' });
                        } else {
                            general.findOne({}, (err, info) => {
                                if (err) {
                                    res.json({ success: false, message: err });
                                } else {
                                    if (info) {
                                        res.json({ success: false, message: 'info of one school only  is required' });
                                    } else {
                                        let school = new general({
                                            title: req.body.title,
                                            motto: req.body.motto,
                                            address: req.body.address,
                                            phone: req.body.phone,
                                            email: req.body.email
                                        });

                                        school.save((err) => {
                                            if (err) {
                                                if (err.code === 11000) {
                                                    res.json({ success: false, message: 'info already exists' });
                                                } else {
                                                    if (err.errors) {
                                                        if (err.errors.title) {
                                                            res.json({ success: false, message: err.errors.title.message });
                                                        } else {
                                                            if (err.errors.motto) {
                                                                res.json({ success: false, message: err.errors.motto.message });
                                                            } else {
                                                                if (err.errors.address) {
                                                                    res.json({ success: false, message: err.errors.address.message });
                                                                } else {
                                                                    if (err.errors.phone) {
                                                                        res.json({ success: false, message: err.errors.phone.message });
                                                                    } else {
                                                                        if (err.errors.email) {
                                                                            res.json({ success: false, message: err.errors.email.message });
                                                                        } else {
                                                                            res.json({ success: false, message: 'failed to save school info ' + err });
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        res.json({ success: false, message: err });
                                                    }
                                                }
                                            } else {
                                                res.json({ success: true, message: 'school info added successfully' });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    router.get('/allinfo', (req, res) => {
        general.find({}, (err, info) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!info) {
                    res.json({ success: false, message: 'no school info was found' });
                } else {
                    res.json({ success: true, message: 'school info loaded', info: info });
                }
            }
        });
    });
    router.get('/info/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'Id required' });
        } else {
            general.findOne({ _id: req.params.id }, (err, info) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!info) {
                        res.json({ success: false, message: 'no school info found' });
                    } else {
                        res.json({ success: true, message: 'school info loaded', school: info });
                    }
                }
            });
        }
    });
    router.put('/editinfo', (req, res) => {
        if (!req.body._id) {
            res.json({ success: false, message: 'info id required' });
        } else {
            general.findOne({ _id: req.body._id }, (err, info) => {
                if (err) {
                    res.json({ success: false, message: err.message });
                } else {
                    if (!info) {
                        res.json({ success: false, message: 'wrong id provided' });
                    } else {
                        if (!req.body.title) {
                            res.json({ success: false, message: 'school title is required' });
                        } else {
                            if (!req.body.motto) {
                                res.json({ success: false, message: 'school motto is required' });
                            } else {
                                if (!req.body.address) {
                                    res.json({ success: false, message: 'school address is required' });
                                } else {
                                    if (!req.body.phone) {
                                        res.json({ success: false, message: 'school phone number is required' });
                                    } else {
                                        if (!req.body.email) {
                                            res.json({ success: false, message: 'school email is required' });
                                        } else {
                                            info.title = req.body.title;
                                            info.motto = req.body.motto;
                                            info.address = req.body.address;
                                            info.phone = req.body.phone;
                                            info.email = req.body.email;

                                            info.save((err) => {
                                                if (err) {
                                                    if (err.errors) {
                                                        if (err.errors.title) {
                                                            res.json({ success: false, message: err.errors.title.message });
                                                        } else {
                                                            if (err.errors.motto) {
                                                                res.json({ success: false, message: err.errors.motto.message });
                                                            } else {
                                                                if (err.errors.address) {
                                                                    res.json({ success: false, message: err.errors.address.message });
                                                                } else {
                                                                    if (err.errors.phone) {
                                                                        res.json({ success: false, message: err.errors.phone.message });
                                                                    } else {
                                                                        if (err.errors.email) {
                                                                            res.json({ success: false, message: err.errors.email.message });
                                                                        } else {
                                                                            res.json({ success: false, message: 'failed to edit school info' + err });
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        res.json({ success: false, message: err.message });
                                                    }

                                                } else {
                                                    res.json({ success: true, message: 'school info edited successfully' });
                                                }
                                            });

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    });
    router.delete('/deleteinfo/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'info id required' });
        } else {
            general.findOne({ _id: req.params.id }, (err, info) => {
                if (err) {
                    res.json({ success: false, message: err.message });
                } else {
                    if (!info) {
                        res.json({ success: false, message: 'wrong info id' });
                    } else {
                        info.remove((err) => {
                            if (err) {
                                res.json({ success: false, message: err.message });
                            } else {
                                res.json({ success: true, message: 'school info deleted successfully' });
                            }
                        });
                    }
                }
            });
        }

    });

    router.get('/sales', (req, res) => {
        sales.find({}).sort({ '_id': -1 }).exec((err, sale) => {
            if (err) {
                res.json({ success: false, message: err.message });
            } else {
                if (!sale) {
                    res.json({ success: false, message: 'no sale found' });
                } else {
                    res.json({ success: true, message: 'Bills loaded', sale: sale });
                }
            }
        });
    });

    router.get('/payments', (req, res) => {
        pay.find({}).sort({ '_id': -1 }).exec( (err, payment) => {
            if (err) {
                res.json({ success: false, message: err.message });
            } else {
                if (!payment) {
                    res.json({ success: false, message: 'no payment found' });
                } else {
                    res.json({ success: true, message: 'payments loaded', payment: payment });
                }
            }
        });
    });
    return router;
}