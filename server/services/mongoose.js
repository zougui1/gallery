const mongoose = require('mongoose');
require('../config/')('db');
const Image = require('../models/Image');
const User = require('../models/User');

exports.getAllImages = () => {
    
}

exports.setImage = image => {
    let imageSave = new Image({
            image: image.image,
            canvas: {
                draw: image.draw,
                text: image.text
            },
            tags: [image.tag, 'everything'],
            isNsfw: image.isNsfw,
            artistName: image.artistName,
            artistLink: image.artistLink,
            characterName: image.characterName
        })
    return imageSave.save();
}

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