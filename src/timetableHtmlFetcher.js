import fetch from "node-fetch";

// -----------------------------------------------------------
// Credits to Marlon Bernardes
// https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable
function iso8859_1_StreamToString (stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('latin1')))
  })
}

export default function fetchTimetables(urlList) {
  return Promise.all(
    urlList.map(
      (urlItem) =>
        new Promise((resolve, reject) => {
          fetch(urlItem.url)
            .then((res) => res.body)
            .then(iso8859_1_StreamToString)
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
