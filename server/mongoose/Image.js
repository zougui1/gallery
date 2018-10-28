const Image = require('../models/Image');


exports.getAllImagesByUser = username => {
    return Image.find({ username: username });
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
            username: 'zougui'
        })
    return imageSave.save();
}