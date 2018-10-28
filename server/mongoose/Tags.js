const Tags = require('../models/Tags');
const { inArray } = require('../utils');

exports.getAllTags = () => {
    return Tags.find();
}

exports.setTags = (tags, existingTags) => {
    let lastTagSave;
    tags.forEach(tag => {
        if(!inArray(tag, existingTags)) {
            console.log(tag)
            let tagSave = new Tags({
                name: tag,
            });
            lastTagSave = tagSave.save();
        }
    });
    return lastTagSave;
}