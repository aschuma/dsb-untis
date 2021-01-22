const jsdom = require("jsdom");
const jquery = require("jquery");

function parse(html) {
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
    console.debug(i + " #size=" + j + " -> ", result);
    table.push(result);
  }
  console.debug(i + " -> ", table);
  return table;
}

module.exports = parse;
