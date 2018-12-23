const Tags = require('../models/Tags');
const { inArray } = require('../utils');
const { clearHash } = require('../services/redis');

exports.getAllTags = () => {
    return Tags.find().log('getAllTags').cache();
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
    clearHash();
    return lastTagSave;
}
