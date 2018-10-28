const User = require('../models/User');


exports.signup = user => {
    let userSave = new User({
        username: user.username,
        password: user.password
    });
    return userSave.save();
}

exports.login = user => {
    return User.findOne({ username: user.username }, (err, userinDB) => {
    })
}