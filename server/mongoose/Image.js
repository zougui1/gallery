const Image = require('../models/Image');
const { clearHash } = require('../services/redis');
require('../services/logging');

const imagePerPage = 30;

exports.getImagesByUserAndTags = (username, tags, page) => {
    tags = tags.length > 0 ? tags : ['everything'];
    return Image
        .find({ username: username, tags: {$in: tags} })
        .skip((page - 1) * imagePerPage)
        .limit(imagePerPage)
        .log('getImagesByUserAndTags')
        .sort({_id: -1});
}

exports.getImagesCount = (username, tags) => {
    tags = tags.length > 0 ? tags : ['everything'];
    return Image.countDocuments({ username, tags: {$in: tags} });
}

exports.getImagesByUser = (username, page) => {
    return Image
        .find({ username: username })
        .skip((page - 1) * imagePerPage)
        .limit(imagePerPage)
        .log('getImagesByUser')
        .sort({_id:-1});
}

exports.getImageById = id => {
    return Image.findById(id).log('getImageById').cache({ key: id });
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
    clearHash(image.username);
    return imageSave.save();
}
