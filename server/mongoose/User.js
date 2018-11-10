const User = require('../models/User');
const mongoose = require('mongoose');



exports.signup = user => {
    let userSave = new User({
        _id: mongoose.Types.ObjectId(),
        username: user.username,
        password: user.password
    });
    return userSave.save();
}

exports.login = user => {
    return User.findOne({ username: user.username })
}