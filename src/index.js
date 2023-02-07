const DSB = require("dsbapi");
const http = require("http");
const parseTimetableHtml = require("./timetableHtmlParser");
const fetchTimetables = require("./timetableHtmlFetcher");
const resolveTimetableUrls = require("./timetableUrlResolver");

require("./jsonHelper")();
require("console-stamp")(console, "yyyy-MM-dd HH:mm:ss");
console.debug = () => {};

function flatten(table) {
  let currentClass = "";
  return table
    .map((cells) => {
      let mappedCells = cells;
      if (cells.length == 1) {
        currentClass = cells[0];
        mappedCells = null;
      } else {
        mappedCells = [currentClass, ...mappedCells];
      }
      return mappedCells;
    })
    .filter((cells) => cells != null);
}

class DsbUntis {
  /**
   * @param {String|Number} username
   * @param {String|Number} password
   * @param {String} [cookies=""] If you already have session cookies, you can add them here.
   * @param {String|Boolean} [cache=false] In the browser just a boolean and in node a path string. If you don't want to use any cache just use undefined, null or false.
   * @param {Axios} [axios=require('axios')] Pass your custom axios instance if you want.
   */
  constructor(
    username,
    password,
    cookies = "",
    cache = false,
    axios = require("axios")
  ) {
    this.dsb = new DSB(username, password, cookies, cache, axios);
  }

  /**
   * Fetch data
   * @param {Boolean} [flat=false] flatten the result table
   * @returns {Promise.<Object>}
   */
  async fetch(flat = false) {
    const dsbNodes = await this.dsb.fetch();
    if (dsbNodes.Resultcode == 0) {
      const urlList = resolveTimetableUrls(dsbNodes);
      const timetableHtmlList = await fetchTimetables(urlList);
      const postprocessor = flat ? flatten : (id) => id;
      const data = timetableHtmlList.map((timetableHtml) => {
        const { header, table } = parseTimetableHtml(timetableHtml.html);
        const answer = {
          ...timetableHtml,
          header,
          table: postprocessor(table),
        };
        delete answer.html;
        return answer;
      });
      return data;
    } else {
      throw Error(dsbNodes.ResultStatusInfo);
    }
  }

  /**
   * Start a HTTP server
   * @param {Number} [port=8080] server port
   * @param {Boolean} [flat=false] flatten the result table
   */
  listen(port = 8080, flat = false) {
    const requestListener = (req, res) => {
      res.setHeader("Content-Type", "application/json;charset=utf-8");
      this.fetch(flat)
        .then((data) => {
          res.writeHead(200);
          res.end(JSON.stringify(data));
          console.log(200, "OK");
        })
        .catch((e) => {
          try {
            res.writeHead(500, e.message);
            res.end(JSON.stringify(e));
          } catch (e) {
          } finally {
            console.log(500, e.message);
          }
        });
    };

    http.createServer(requestListener).listen(port);
  }
}

module.exports = DsbUntis;
