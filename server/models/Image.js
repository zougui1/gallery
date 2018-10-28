const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    image: String,
    canvas: {
        text: String,
        draw: String
    },
    tags: Array,
    isNsfw: Boolean,
    artistName: String,
    artistLink: String,
    characterName: String,
    userId: String,
    username: String,
});

module.exports = mongoose.model('Image', imageSchema);