const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    image: {type: String, required: true},
    thumb: {type: String, required: true},
    canvas: {
        text: String,
        draw: String
    },
    tags: {type: Array, required: true},
    isNsfw: {type: Boolean, required: true},
    artistName: String,
    artistLink: String,
    characterName: String,
    username: {type: String, required: true},
});

module.exports = mongoose.model('Image', imageSchema);
exports.ObjectId = mongoose.Types.ObjectId;
