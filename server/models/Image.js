const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    image: String,
    canvas: {
        text: String,
        draw: String
    },
    tags: Array,
    artist: String
});

module.exports = mongoose.model('Image', imageSchema);