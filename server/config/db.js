const mongoose = require('mongoose');
const api = require('./api');
require('./global');
mongoose.Promise = Promise;

mongoose.connect(api.monngoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB starting'.green))
    .catch(err => {
        console.error(`MongoDB error ${err}`.red);
        process.exit(1);
    });

mongoose.set('useFindAndModify', false);