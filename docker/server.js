const DsbUntis = require('../src/index.js')

const username = process.env.USERNAME || 'username';
const password = process.env.PASSWORD || 'password';
const flatFormat = "true" === process.env.FLATFORMAT;

console.log(`Starting server (USERNAME=${username}, PASSWORD=${password.slice(0,1)}..., FLATFORMAT=${flatFormat})`);

const dsbUntis = new DsbUntis(username, password);
    
dsbUntis.listen(8080,flatFormat);

