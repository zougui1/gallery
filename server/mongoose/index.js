const {
    getAllImagesByUser,
    getImageById,
    setImage,
} = require('./Image');
const {
    signup,
    login,
} = require('./User');
const {
    getAllTags,
    setTags
} = require('./Tags');


// User model request
exports.signup = signup;
exports.login = login;
// Image model request
exports.getAllImagesByUser = getAllImagesByUser;
exports.getImageById = getImageById;
exports.setImage = setImage;
// Tags model request
exports.getAllTags = getAllTags;
exports.setTags = setTags;