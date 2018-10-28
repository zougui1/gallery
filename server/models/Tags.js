const mongoose = require('mongoose');

const tagsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model('Tags', tagsSchema);