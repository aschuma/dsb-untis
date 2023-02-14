const DsbUntis = require('../src/index.js')

const username = process.env.USERNAME || 'username';
const password = process.env.PASSWORD || 'password';

// see timetableHtmlExtractors
//
//  extractorDivMonTitle
//  extractorTableInfo
//  extractorTableMonList | extractorTableMonListFlat
const extractorList = (process.env.EXTRACTORS || 'extractorTableMonList, extractorDivMonTitle').split(",").map(item => item.trim());

console.log(`Starting server (USERNAME=${username}, PASSWORD=${password.slice(0,1)}..., EXTRACTORS=${extractorList})`)

const dsbUntis = new DsbUntis(username, password);

dsbUntis.listen(8080, {extractors: extractorList});

