/*
 * Note: Sources in this directory, derived from
 * the branch 'snyk-fix-cc40e65606e8cf4b2e7d5fbabfa97dc4'
 * on the GitHub repository https://github.com/TheNoim/DSBAPI/,
 * are licensed under the Apache 2 License. Please adhere to
 * the terms of this license when using, modifying, or
 * distributing these sources.
 */

import Encode from "./DSBEncoding.js";
import Decode from "./DSBDecode.js";
import axios from "axios";

export default class DSB {
  /**
   *
   * @param {String|Number} username
   * @param {String|Number} password
   */
  constructor(username, password) {
    /**
     * @private
     */
    this.username = username;
    /**
     * @private
     */
    this.password = password;
    /**
     * @private
     */
    this.axios = axios;
    /**
     * @private
     */
    this.urls = {
      Data: "https://app.dsbcontrol.de/JsonHandler.ashx/GetData",
    };

    /**
     * @private
     */
    this.axios.defaults.headers.common["User-Agent"] =
      "DSBmobile/9759 (iPhone; iOS 13.2.2; Scale/3.00)";
  }

  /**
   * Fetch data
   * @returns {Promise.<Object>}
   */
  async fetch() {
    const response = await this.axios({
      method: "POST",
      data: {
        req: {
          Data: Encode({
            PushId: "",
            UserId: this.username,
            UserPw: this.password,
            Device: "iPhone",
            AppVersion: "2.5.6",
            Language: "en-DE",
            Date: new Date(),
            BundleId: "de.digitales-schwarzes-brett.dsblight",
            OsVersion: "13.2.2",
            LastUpdate: new Date(),
            AppId: "BC86F8E5-5D4A-4A19-A317-04D1E52FF9ED",
          }),
          DataType: 1,
        },
      },
      url: this.urls.Data,
      onUploadProgress(e) {
        console.log(JSON.stringify(e));
      },
      onDownloadProgress(e) {
        console.log(JSON.stringify(e));
      },
    });
    if (!response.data.d) throw new Error("Invalid data.");
    return Decode(response.data.d);
  }
}

DSB.Decode = Decode;
DSB.Encode = Encode;
