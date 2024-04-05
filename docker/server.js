import DsbUntis from "../src/index.js";

const username = process.env.USERNAME || "username";
const password = process.env.PASSWORD || "password";
const debug = process.env.DEBUG === "true" || false;

// see timetableHtmlExtractors
//
//  extractorDivMonTitle
//  extractorTableInfo
//  extractorTableMonList | extractorTableMonListFlat
const extractorList = (
  process.env.EXTRACTORS || "extractorTableMonList, extractorDivMonTitle"
)
  .split(",")
  .map((item) => item.trim());

console.log(
  `Starting server (USERNAME=${username}, PASSWORD=${password.slice(
    0,
    1
  )}..., EXTRACTORS=${extractorList}, DEBUG=${debug})`
);

if (!debug) {
  console.debug = () => {};
  console.log = () => {};
}

const dsbUntis = new DsbUntis(username, password);

dsbUntis.listen(8080, { extractors: extractorList });
