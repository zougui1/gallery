const path = require('path');
const { app, express } = require('./config/')('server');
require('./logger');
require('./socket');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const build = express.static(path.join(__dirname, '/../build'));

app.use('/', build);
app.use('*', build);

//const event = require('e')
