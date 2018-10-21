const mongoose = require('mongoose');
require('../config/')('db');
const Image = require('../models/Image');

exports.getAllImages = () => {
    
}

exports.setImage = image => {
    let imageSave = new Image({
            image: image.image,
            canvas: {
                draw: image.draw,
                text: image.text
            }
        })
    return imageSave.save();
}