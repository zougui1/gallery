const path = require('path');
const { app, port, express } = require('./config/')('server');
require('./logger');
require('./socket');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


const urlStr = `/ /upload /signup /login
/user/:username /user/:username/:page /image/:id`;
const urlArr = urlStr.split(/\s/);
const build = express.static(path.join(__dirname, '/../build'));
urlArr.forEach(url => {
    app.use(url, build);
});

//app.use('**', build);
