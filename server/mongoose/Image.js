const Image = require('../models/Image');

const imagePerPage = 30;

exports.getImagesByUserAndTags = (username, tags) => {
    return Image.find({ username: username, tags: {$in: tags} });
}

exports.getImagesByUser = (username, page) => {
    setTimeout(() => console.log(username, page, (page - 1) * imagePerPage), 1000)
    return Image.find({ username: username }).skip((page - 1) * imagePerPage).limit(imagePerPage).sort({_id:-1});
}

exports.getImageById = id => {
    return Image.findById(id);
}

exports.setImage = image => {
    let imageSave = new Image({
            image: image.image,
            canvas: {
                draw: image.draw,
                text: image.text
            },
            tags: [...image.tags, 'everything'],
            isNsfw: image.isNsfw,
            artistName: image.artistName,
            artistLink: image.artistLink,
            characterName: image.characterName,
            username: image.username
        })
    return imageSave.save();
}