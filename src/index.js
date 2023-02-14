const DSB = require("dsbapi");
const http = require("http");
const buildInHtmlExtractors = require("./timetableHtmlExtractors/index")
const fetchTimetables = require("./timetableHtmlFetcher");
const resolveTimetableUrls = require("./timetableUrlResolver");

require("./jsonHelper")();
console.debug = () => {
};

class DsbUntis {
  /**
   * @param {String|Number} username
   * @param {String|Number} password
   * @param {String} [cookies=""] If you already have session cookies, you can add them here.
   * @param {String|Boolean} [cache=false] In the browser just a boolean and in node a path string. If you don't want to use any cache just use undefined, null or false.
   * @param {Axios} [axios=require('axios')] Pass your custom axios instance if you want.
   */
  constructor(username, password, cookies = "", cache = false, axios = require("axios")) {
    this.dsb = new DSB(username, password, cookies, cache, axios);
  }

  /**
   * Fetch data
   * @param {Object.<String, (String|Number|Function|Array)>} configuration
   * @returns {Promise.<Object>}
   */
  async fetch(configuration = {extractors: [buildInHtmlExtractors.extractorTableMonList]}) {

    const {extractors = [buildInHtmlExtractors.extractorTableMonList]} = configuration;
    const buildInHtmlExtractorNames = Object.keys(buildInHtmlExtractors);

    console.debug("Configured extractors:", extractors);
    console.debug("Available extractors:", buildInHtmlExtractorNames);

    const resolvedExtractors = extractors.reduce((acc, functionOrName) => {

      if (typeof functionOrName === 'string') {
        if (buildInHtmlExtractorNames.includes(functionOrName)) {
          acc.push(buildInHtmlExtractors[functionOrName]);
        }
      } else if (typeof functionOrName === 'function') {
        acc.push(functionOrName);
      }
      return acc;
    }, []);

    console.debug("Resolved extractors:", resolvedExtractors);

    const dsbNodes = await this.dsb.fetch();
    if (dsbNodes.Resultcode === 0) {
      const urlList = resolveTimetableUrls(dsbNodes);
      const timetableHtmlList = await fetchTimetables(urlList);
      const data = timetableHtmlList.map((timetableHtml) => {
        const extractedData = resolvedExtractors.reduce((acc, extractor) => ({...acc, ...extractor(timetableHtml.html)}), {});
        const answer = {
          ...timetableHtml, ...extractedData,
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
   * @param {Object.<String, (String|Number|Function|Array)>} configuration
   */
  listen(port = 8080, configuration = {extractors: [buildInHtmlExtractors.extractorTableMonList]}) {

    require("console-stamp")(console, "yyyy-MM-dd HH:mm:ss");

    const requestListener = (req, res) => {
      res.setHeader("Content-Type", "application/json;charset=utf-8");
      this.fetch(configuration)
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
