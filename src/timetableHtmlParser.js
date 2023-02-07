const jsdom = require("jsdom");
const jquery = require("jquery");

function parse(html) {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  const $ = jquery(dom.window);

  const table = [];

  var title = $("div.mon_title");
  var content = [];
  for (let i = 0; i < title.length; i++) {
    content.push($(title[i]).html());
  }
  table.push(content);

  var info = $("table.info tr");
  for (var i = 0; i < info.length; i++) {
    const result = [];
    const cells = [
      ...$($(info)[i]).children("th"),
      ...$($(info)[i]).children("td"),
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

  var items = $("table.mon_list tr");
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

