
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

function isTimetableNode(dsbNode) {
  return dsbNode.Detail && `${dsbNode.Detail}`.endsWith("htm");
}

export default function resolveUrls(dsbNode, fn = isTimetableNode) {
  let answer = [];

  if (dsbNode) {
    if (fn(dsbNode)) {
      answer = [
        ...answer,
        {
          id: dsbNode.Id,
          title: dsbNode.Title,
          url: dsbNode.Detail,
          date: parseDate(dsbNode.Date),
          dateString: dsbNode.Date,
        },
      ];
    } else {
      if (Array.isArray(dsbNode)) {
        answer = [
          ...answer,
          ...dsbNode.flatMap((item) => resolveUrls(item, fn)),
        ];
      }
      if (dsbNode.Root) {
        answer = [...answer, ...resolveUrls(dsbNode.Root, fn)];
      }
      if (dsbNode.Childs) {
        answer = [...answer, ...resolveUrls(dsbNode.Childs, fn)];
      }
      if (dsbNode.ResultMenuItems) {
        answer = [
          ...answer,
          ...resolveUrls(dsbNode.ResultMenuItems, fn),
        ];
      }
    }
  }

  console.debug( "TimetableUrls", answer );

  return answer;
}
