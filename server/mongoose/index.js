const {
    getImagesByUser,
    getImageById,
    setImage,
    getImagesByUserAndTags,
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
exports.getImagesByUser = getImagesByUser;
exports.getImageById = getImageById;
exports.setImage = setImage;
exports.getImagesByUserAndTags = getImagesByUserAndTags;
// Tags model request
exports.getAllTags = getAllTags;
exports.setTags = setTags;