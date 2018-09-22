const User = require('../models/user');
const uniforms = require('../models/uniforms');
const meal = require('../models/menu');
const pay = require('../models/payments');
const sales = require('../models/sales');
const general = require('../models/general');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
module.exports = (router) => {

    router.post('/login', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'email must be provided' });
        } else {
            if (!req.body.password) {
                res.json({ success: false, message: 'password is required' });
            } else {
                User.findOne({ email: req.body.email }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {
                        if (!user) {
                            res.json({ success: false, message: 'user was not found' });
                        } else {
                            const validpassword = user.comparepassword(req.body.password);
                            if (!validpassword) {
                                res.json({ success: false, message: 'invalid password' });
                            } else {
                                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '1h' });

                                res.json({ success: true, message: 'Welcome', token: token, user: { username: user.username } });
                            }
                        }
                    }
                });
            }
        }
    });
    //-----------------------------------------------------------------------middleware------------------------------------------------------------------//
    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({ success: false, message: 'No token was provided' });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'invalid token' + err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });
    //-----------------------------------------------------------------------middleware------------------------------------------------------------------//
    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Your profile was not found' });
                } else {
                    res.json({ success: true, message: 'Profile loaded', profile: user });
                }
            }
        });
    });
    // get uniforms
    router.get('/alluniforms', (req, res) => {
        uniforms.find({}, (err, uniforms) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, uniforms: uniforms });
            }
        });
    });
    // makesale
    router.put('/makesale', (req, res) => {
        if (!req.body.product) {
            res.json({ success: false, message: 'product is required' });
        } else {
            uniforms.findOne({ _id: req.body.product }, (err, uniform) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    var prize = uniform.price;

                    if (!req.body.quantity) {
                        res.json({ success: false, message: 'quantity is required' });
                    } else {
                        if (uniform.stock <= 2) {
                            res.json({ success: false, message: 'Low on stock' });
                        } else {
                            newstock = uniform.stock -= req.body.quantity;

                            uniform.stock = newstock;

                            uniform.save((err) => {
                                if (err) {
                                    res.json({ success: false, message: err });
                                } else {
                                    if (!req.body.paid) {
                                        res.json({ success: false, message: 'amount paid is required' });
                                    } else {
                                        var tot = uniform.price *= req.body.quantity;
                                        if (req.body.paid < tot) {
                                            res.json({ success: false, message: 'amount paid cannot be less than the price' });

                                        } else {
                                            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                                if (err) {
                                                    res.json({ success: false, message: err });
                                                } else {

                                                    let sale = new sales({
                                                        product: uniform.product,
                                                        price: prize,
                                                        quantity: req.body.quantity,
                                                        paid: req.body.paid,
                                                        change: req.body.paid -= tot,
                                                        servedby: user.username,
                                                        total: tot
                                                    });
                                                    sale.save((err) => {
                                                        if (err) {
                                                            if (err.errors) {
                                                                if (err.errors.product) {
                                                                    res.json({ success: false, message: err.errors.product.message });
                                                                } else {
                                                                    if (err.errors.quantity) {
                                                                        res.json({ success: false, message: err.errors.quantity.message });
                                                                    } else {
                                                                        if (err.errors.paid) {
                                                                            res.json({ success: false, message: err.errors.paid.message });
                                                                        } else {
                                                                            res.json({ success: false, message: 'failed to order' + err });
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                res.json({ success: false, message: err });
                                                            }
                                                        } else {
                                                            res.json({ success: true, message: 'sale made successfully', sale: sale._id });
                                                        }
                                                    });
                                                }
                                            });

                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    });

    router.get('/order/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'order id required' });
        } else {
            sales.findOne({ _id: req.params.id }, (err, order) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!order) {
                        res.json({ success: false, message: 'No order was found' });
                    } else {
                        res.json({ success: true, message: 'order found', order: order });
                    }
                }
            });
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
                    res.json({ success: true, menu: menu });
                }
            }
        });
    });

    router.post('/payment', (req, res) => {
        if (!req.body.student) {
            res.json({ success: false, message: 'student name is required' });
        } else {
            if (!req.body.food) {
                res.json({ success: false, message: 'food is required' });
            } else {
                meal.findOne({ food: req.body.food }, (err, food) => {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {
                        if (!food) {
                            res.json({ success: false, message: 'no food was found' });
                        } else {
                            var prize = food.price;
                            if (!req.body.amount) {
                                res.json({ success: false, message: 'payment must be made' });
                            } else {
                                pay.findOne({ student: req.body.student, balance: { $gt: 0 } }, (err, balance) => {
                                    if (err) {
                                        res.json({ success: false, message: err });
                                    } else {
                                        if (!balance) {
                                            var bal = food.price -= req.body.amount;
                                            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                                if (err) {
                                                    res.json({ success: false, message: err });
                                                } else {
                                                    var serve = user.username;

                                                    let payment = new pay({
                                                        student: req.body.student,
                                                        food: req.body.food,
                                                        price: prize,
                                                        amount: req.body.amount,
                                                        balance: bal,
                                                        servedby: serve,

                                                    });
                                                    payment.save((err) => {
                                                        if (err) {
                                                            if (err.errors) {
                                                                if (err.errors.student) {
                                                                    res.json({ success: false, message: err.errors.student.message });
                                                                } else {
                                                                    if (err.errors.food) {
                                                                        res.json({ success: false, message: err.errors.food.message });
                                                                    } else {
                                                                        if (err.errors.amount) {
                                                                            res.json({ success: false, message: err.errors.amount.message });
                                                                        } else {
                                                                            res.json({ success: false, message: 'failed to save payment' + err });
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                res.json({ success: false, message: err });
                                                            }

                                                        } else {
                                                            res.json({ success: true, message: 'payment made', payment: payment._id })
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            res.json({ success: false, message: 'balance found ', bid: balance._id, balance: balance.balance });
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
    });
    router.get('/balance/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'Balance id required' });
        } else {
            pay.findOne({ _id: req.params.id }, (err, bal) => {
                if (err) {
                    res.json({ success: false, message: 'Failed' + err });
                } else {
                    if (!bal) {
                        res.json({ success: false, message: 'No balance found' });
                    } else {
                        res.json({ success: true, message: 'Balance loaded', balance: bal });
                    }
                }
            });
        }
    });

    router.put('/paybalance', (req, res) => {
        if (!req.body._id) {
            res.json({ success: false, message: 'Balance id is required' });
        } else {
            pay.findOne({ _id: req.body._id }, (err, payment) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!payment) {
                        res.json({ success: false, message: 'No payment was found' });
                    } else {
                        if (!req.body.amount) {
                            res.json({ success: false, message: 'amount paid is required' });
                        } else {
                            var amount = parseFloat(req.body.amount);

                            var newbalance = payment.balance -= amount;
                            var newamount = amount += payment.amount;

                            payment.amount = newamount;
                            payment.balance = newbalance;

                            payment.save((err) => {
                                if (err) {
                                    if (err.errors) {
                                        if (err.errors.amount) {
                                            res.json({ success: false, message: err.errors.amount.message });
                                        } else {
                                            res.json({ success: false, message: 'could not make payment' + err });
                                        }
                                    } else {
                                        res.json({ success: false, message: err });
                                    }

                                } else {
                                    res.json({ success: true, message: 'Balance paid', pid: payment._id });
                                }
                            });


                        }
                    }
                }
            });
        }
    });
    router.get('/paymentreceipt/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'payment id is required' });
        } else {
            pay.findOne({ _id: req.params.id }, (err, transaction) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!transaction) {
                        res.json({ success: false, message: 'transaction could not be found' });
                    } else {
                        res.json({ success: true, message: 'transaction found', transaction: transaction });
                    }
                }
            });
        }
    });

    router.get('/allinfo', (req, res) => {
        general.findOne({}, (err, info) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!info) {
                    res.json({ success: false, message: 'no school info was found' });
                } else {
                    res.json({ success: true, info: info });
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