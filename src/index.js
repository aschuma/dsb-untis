const DSB = require("dsbapi");
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const jquery = require("jquery");
const http = require("http");

// -----------------------------------------------------------
// Credits to Jonathan Lonowski, see
// https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
if (!("toJSON" in Error.prototype)) {
  Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
      var alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });
}
// -----------------------------------------------------------

function parseDate(dateString /* DD.MM.YYYY HH:mm */) {
  let date = null;
  const rawChunks = `${dateString}`.split(/[\.| |:]/);
  if (rawChunks.length == 5) {
    try {
      const chunks = rawChunks.map((raw) => parseInt(raw.replace(/^0+/, "")));
      date = new Date(
        chunks[2],
        chunks[1] - 1,
        chunks[0],
        chunks[3],
        chunks[4]
      );
    } catch (e) {}
  }
  return date;
}

function extractTimetableUrls(dsbNode, fn) {
  let answer = [];

  if (dsbNode) {
    if (fn(dsbNode)) {
      answer = [
        ...answer,
        {
          url: dsbNode.Detail,
          date: parseDate(dsbNode.Date),
          dateString: dsbNode.Date,
        },
      ];
    } else {
      if (Array.isArray(dsbNode)) {
        answer = [
          ...answer,
          ...dsbNode.flatMap((item) => extractTimetableUrls(item, fn)),
        ];
      }
      if (dsbNode.Root) {
        answer = [...answer, ...extractTimetableUrls(dsbNode.Root, fn)];
      }
      if (dsbNode.Childs) {
        answer = [...answer, ...extractTimetableUrls(dsbNode.Childs, fn)];
      }
      if (dsbNode.ResultMenuItems) {
        answer = [
          ...answer,
          ...extractTimetableUrls(dsbNode.ResultMenuItems, fn),
        ];
      }
    }
  }

  return answer;
}

function isTimetableNode(dsbNode) {
  return dsbNode.Detail && `${dsbNode.Detail}`.endsWith("htm");
}

function fetchTimetableHtml(urlList) {
  return Promise.all(
    urlList.map(
      (urlItem) =>
        new Promise((resolve, reject) => {
          fetch(urlItem.url)
            .then((res) => res.text())
            .then((res) =>
              resolve({
                ...urlItem,
                html: res,
              })
            )
            .catch((e) => {
              reject(e);
            });
        })
    )
  );
}

function parseUntisTimetableHtml(html) {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  const $ = jquery(dom.window);

  var items = $("table.mon_list tr");
  const table = [];
  for (var i = 0; i < items.length; i++) {
    const result = [];
    const cells = [
      ...$($(items)[i]).children("th"),
      ...$($(items)[i]).children("td"),
    ];
    for (var j = 0; j < cells.length; j++) {
      const rawCell = $(cells[j]).html();
      const strikeCell = $(cells[j]).find("strike").html();
      const spanCell = $(cells[j]).find("span").html();
      let cell = spanCell || strikeCell || rawCell;
      cell = "&nbsp;" == cell ? "" : cell;
      result.push(cell);
    }
    // console.log(i + " #size=" + j + " -> ", result);
    table.push(result);
  }
  // console.log(i + " -> ", table);
  return table;
}

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
      const urlList = extractTimetableUrls(dsbNodes, isTimetableNode);
      const timetableHtmlList = await fetchTimetableHtml(urlList);
      const postprocessor = flat ? flatten : (id) => id;
      const data = timetableHtmlList.map((timetableHtml) => ({
        date: timetableHtml.date,
        dateString: timetableHtml.dateString,
        table: postprocessor(parseUntisTimetableHtml(timetableHtml.html)),
      }));
      return data;
    } else {
      throw Error(dsbNodes.ResultStatusInfo);
    }
  }

  /**
   * Start a HTTP server
   * @param {Number} [port=8080] server port
   * @param {Boolean} [flat=false] flatten the result table
   * @returns {Promise.<Object>}
   */
  listen(port = 8080, flat = false) {
    const requestListener = (req, res) => {    
      res.setHeader("Content-Type", "application/json;charset=utf-8");
      this.fetch(flat)
        .then((data) => {
          res.writeHead(200);
          res.end(JSON.stringify(data));
        })
        .catch((e) => {
          res.writeHead(500, e.message);
          res.end(JSON.stringify(e));
        });
    };

    http.createServer(requestListener).listen(port);
  }
}

module.exports = DsbUntis;
