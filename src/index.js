import dsbFetch from "./dsbapi/index.js";
import { createServer } from "http";
import buildInHtmlExtractors from "./timetableHtmlExtractors/index.js";
import fetchTimetables from "./timetableHtmlFetcher.js";
import resolveTimetableUrls from "./timetableUrlResolver.js";

import consoleStamp from "console-stamp";
consoleStamp(console, "yyyy-mm-dd HH:MM:ss");

import jsonHelper from "./jsonHelper.js";
jsonHelper();


class DsbUntis {
  /**
   * @param {String|Number} username
   * @param {String|Number} password
   */
  constructor(username, password) {
    this.dsbFetch = () => dsbFetch(username, password);
  }

  /**
   * Fetch data
   * @param {Object.<String, (String|Number|Function|Array)>} configuration
   * @returns {Promise.<Object>}
   */
  async fetch(
    configuration = {
      extractors: [buildInHtmlExtractors.extractorTableMonList],
    }
  ) {
    let { extractors } = configuration;
    extractors = extractors || [buildInHtmlExtractors.extractorTableMonList];
    const buildInHtmlExtractorNames = Object.keys(buildInHtmlExtractors);

    console.debug("Configured extractors:", extractors);
    console.debug("Available extractors:", buildInHtmlExtractorNames);

    const resolvedExtractors = extractors.reduce((acc, functionOrName) => {
      if (typeof functionOrName === "string") {
        if (buildInHtmlExtractorNames.includes(functionOrName)) {
          acc.push(buildInHtmlExtractors[functionOrName]);
        }
      } else if (typeof functionOrName === "function") {
        acc.push(functionOrName);
      }
      return acc;
    }, []);

    console.debug("Resolved extractors:", resolvedExtractors);

    const dsbNodes = await this.dsbFetch();
    if (dsbNodes.Resultcode === 0) {
      const urlList = resolveTimetableUrls(dsbNodes);
      const timetableHtmlList = await fetchTimetables(urlList);
      const data = timetableHtmlList.map((timetableHtml) => {
        const extractedData = resolvedExtractors.reduce(
          (acc, extractor) => ({ ...acc, ...extractor(timetableHtml.html) }),
          {}
        );
        const answer = {
          ...timetableHtml,
          ...extractedData,
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
  listen(port = 8080, configuration = { extractors: [extractorTableMonList] }) {
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

    createServer(requestListener).listen(port);
  }
}

export default DsbUntis;
