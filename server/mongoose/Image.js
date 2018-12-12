const Image = require('../models/Image');
const User = require('../models/User');
const mongoose = require('mongoose');

const imagePerPage = 30;

exports.getImagesByUserAndTags = (username, tags, page) => {
    tags = tags.length > 0 ? tags : ['everything'];
    return Image
        .find({ username: username, tags: {$in: tags} })
        .skip((page - 1) * imagePerPage)
        .limit(imagePerPage)
        .sort({_id: -1});
}

exports.getImagesCount = (username, tags) => {
    tags = tags.length > 0 ? tags : ['everything'];
    return Image.count({ username, tags: {$all: tags} });
}

exports.getImagesByUser = (username, page) => {
    setTimeout(() => console.log(username, page, (page - 1) * imagePerPage), 1000)
    return Image
        .find({ username: username })
        .skip((page - 1) * imagePerPage)
        .limit(imagePerPage)
        .sort({_id:-1});
}

exports.getImageById = id => {
    return Image.findById(id);
}

exports.setImage = image => {
    console.log('setImage')
    let imageSave = new Image({
            image: image.image,
            thumb: image.thumb,
            canvas: {
                draw: image.draw,
                text: image.text
            },
            tags: [...image.tags, 'everything'],
            isNsfw: image.isNsfw,
            artistName: image.artistName,
            artistLink: image.artistLink,
            characterName: image.characterName,
            username: image.username,
        })
    return imageSave.save();
}
