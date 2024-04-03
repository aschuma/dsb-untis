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
import fetch from "node-fetch";

const DSB_URL = "https://app.dsbcontrol.de/JsonHandler.ashx/GetData";

const dsbFetch = async (username, password) => {
  const response = await fetch(DSB_URL, {
    method: "POST",
    body: JSON.stringify({
      req: {
        Data: Encode({
          PushId: "",
          UserId: username,
          UserPw: password,
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
    }),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "DSBmobile/9759 (iPhone; iOS 13.2.2; Scale/3.00)",
    },
  });
  const data = await response.json(); // Assuming the server responds with JSON
  if (!data.d) throw new Error("Invalid data.");
  return Decode(data.d);
};

export default dsbFetch;
