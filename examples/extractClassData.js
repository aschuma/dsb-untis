import DsbUntis from "../src/index.js";

/*
  My actual use case: Get my son's timetable changes and display them on an LED matrix
  (https://github.com/aschuma/max7219-led-matrix-clock-mqtt-display)
*/

function extractClassRows(timetables, clazz) {
  const now = (() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  })();

  const today = (() => `${now.getDate()}.${now.getMonth() + 1}.`)();
  const tomorrow = (() => {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return `${d.getDate()}.${d.getMonth() + 1}.`;
  })();

  console.log("timetables", JSON.stringify(timetables));
  console.log("today", today);
  console.log("tomorrow", tomorrow);

  const todayFilter = (row, index) =>
    index > 0 && row[0] == clazz && row[1] === today;
  const tomorrowFilter = (row, index) =>
    index > 0 && row[0] === clazz && row[1] === tomorrow;

  const filterItems = (items, filter) =>
    items
      .map((item) => {
        const answer = {
          ...item,
          table: item.table.filter((row, index) => filter(row, index)),
        };
        return answer;
      })
      .filter((item) => item.table.length > 0);

  const todayEntries = filterItems(timetables, todayFilter);
  const tomorrowEntries = filterItems(timetables, tomorrowFilter);

  const answer = {
    today: todayEntries,
    tomorrow: tomorrowEntries,
  };

  return answer;
}

const flatMap = (list, fn) => list.reduce((acc, e) => [...acc, ...fn(e)], []);

const collapse = (timetables) => {
  return {
    today: flatMap(timetables.today, (tt) => tt.table),
    tomorrow: flatMap(timetables.tomorrow, (tt) => tt.table),
  };
};

const clazz = "5c";


const username = process.env.USERNAME || "username";
const password = process.env.PASSWORD || "password";

const dsbUntis = new DsbUntis(username, password);
const transform = (timetables) => extractClassRows(timetables, clazz);

dsbUntis
  .fetch({extractors :["extractorTableMonListFlat"]})
  .then(transform)
  .then(collapse)
  .then((data) => {
    console.log(JSON.stringify(data));
  });
