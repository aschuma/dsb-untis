const jsdom = require("jsdom");
const jquery = require("jquery");

function divMonTitle(html) {
  const {JSDOM} = jsdom;
  const dom = new JSDOM(html);
  const $ = jquery(dom.window);

  const header = [];
  const title = $("div.mon_title");
  for (let i = 0; i < title.length; i++) {
    header.push($(title[i]).html());
  }
  console.debug(title.length + " -> ", header);

  return {header: header};
}

function tableInfo(html) {
  const {JSDOM} = jsdom;
  const dom = new JSDOM(html);
  const $ = jquery(dom.window);

  const table = [];
  const items = $("table.info");
  for (let i = 0; i < items.length; i++) {
    const result = [];
    const cells = [...$($(items)[i]).children("th"), ...$($(items)[i]).children("td"),];
    for (let j = 0; j < cells.length; j++) {
      const rawCell = $(cells[j]).html();
      const cell = "&nbsp;" === rawCell ? "" : rawCell;
      result.push(cell);
    }
    console.debug(i + " #size=" + cells.length + " -> ", result);
    table.push(result);
  }

  console.debug(items.length + " -> ", table);

  return {infoTable: table};
}


function tableMonList(html) {
  const {JSDOM} = jsdom;
  const dom = new JSDOM(html);
  const $ = jquery(dom.window);

  const items = $("table.mon_list tr");
  const table = [];
  for (let i = 0; i < items.length; i++) {
    const result = [];
    const cells = [...$($(items)[i]).children("th"), ...$($(items)[i]).children("td"),];
    for (let j = 0; j < cells.length; j++) {
      const rawCell = $(cells[j]).html();
      const strikeCell = $(cells[j]).find("strike").html();
      const spanCell = $(cells[j]).find("span").html();
      let cell = spanCell || strikeCell || rawCell;
      cell = "&nbsp;" === cell ? "" : cell;
      result.push(cell);
    }
    console.debug(i + " #size=" + cells.length + " -> ", result);
    table.push(result);
  }
  console.debug(items.length + " -> ", table);
  return {table};
}

function tableMonListFlat(html) {
  const flatten = table => {
    let currentClass = "";
    return table
      .map((cells) => {
        let mappedCells = cells;
        if (cells.length === 1) {
          currentClass = cells[0];
          mappedCells = null;
        } else {
          mappedCells = [currentClass, ...mappedCells];
        }
        return mappedCells;
      })
      .filter((cells) => cells != null);
  };

  let {table} = tableMonList(html);
  return {table: flatten(table)};
}

module.exports = {
  extractorDivMonTitle: divMonTitle,
  extractorTableInfo: tableInfo,
  extractorTableMonList: tableMonList,
  extractorTableMonListFlat: tableMonListFlat,
};


