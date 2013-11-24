/**
 * Created by zhang on 24/11/2013.
 */
var sys = require('sys'),
    path = require('path'),
    hbs = require('hbs'),
    express = require('express'),
    tester = express(),
    BASE_URL = '/vDisease/',
    ROOT = path.join(__dirname, '../'),
    CSS = path.join(ROOT, '/css/'),
    SCRIPT = path.join(ROOT, '/script/'),
    INDEX = path.join(ROOT, '/index.html');

console.log(ROOT);

tester.set('view engine', 'html');
tester.engine('html', hbs.__express);

tester.use(express.static(ROOT));

tester.get(BASE_URL, function(req, res) {
    res.render(INDEX);
});

tester.listen(3000);
sys.puts('Server Running on 3000');