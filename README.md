
[![version](https://img.shields.io/npm/v/dsb-untis.svg?style=flat-square)](http://npm.im/dsb-untis)
[![downloads](https://img.shields.io/npm/dm/dsb-untis.svg?style=flat-square)](http://npm-stat.com/charts.html?package=dsb-untis&from=2021-01-01)
[![MIT License](https://img.shields.io/npm/l/dsb-untis.svg?style=flat-square)](http://opensource.org/licenses/MIT)

# DSB crawler and Untis's HTML parser / REST server

## Basic Usage

```javascript
const DsbUntis = require('dsb-untis')

const username = "165931";
const password = "secret";

const dsbUntis = new DsbUntis(username, password);
dsbUntis.fetch().then((data) => { 
    console.log(JSON.stringify(data))
});
```

## Server Mode

Start a HTTP server providing the data:

```javascript
const DsbUntis = require('dsb-untis')

const username = "165931";
const password = "secret";

const dsbUntis = new DsbUntis(username, password);
dsbUntis.listen(9000);
```

## Server Mode / Docker Image

Supported platforms:

* linux/amd64
* linux/arm64
* linux/arm/v7 (PI 4a)

```shell
docker run --rm  -d -e USERNAME="165931" -e PASSWORD="secret" -e FLATFORMAT="false"  -p 8080:8080  aschuma/dsb-untis:latest
```

## Example Result

```json
[
  {
    "date": "2021-01-15T16:33:00.000Z",
    "dateString": "15.01.2021 17:33",
    "table": [
      [
        "Datum",
        "Tag",
        "Fach",
        "Stunde",
        "Lehrer",
        "Text",
        "Raum",
        "(Fach)",
        "Art",
        "Vertr. von / verlegt"
      ],
      ["6b"],
      ["15.1.", "Fr", "E", "3 - 4", "Knt", "", "---", "E", "Entfall", ""],
      ["9c"],
      ["15.1.", "Fr", "D", "6", "Nmr", "", "R109", "D", "Vertretung", ""]
    ]
  },
  {
    "date": "2021-01-15T16:33:00.000Z",
    "dateString": "15.01.2021 17:33",
    "table": [
      [
        "Datum",
        "Tag",
        "Klasse(n)",
        "Fach",
        "Stunde",
        "Lehrer",
        "Text",
        "Raum",
        "(Fach)",
        "Grund: (Lehrer)",
        "Art",
        "Vertr. von / verlegt"
      ],
      ["6b"],
      [
        "18.1.",
        "Mo",
        "6b",
        "Mu",
        "3 - 4",
        "Bo",
        "",
        "MuS",
        "Mu",
        "Kfn",
        "Vertretung",
        ""
      ],
      ["7a"],
      [
        "18.1.",
        "Mo",
        "7a",
        "D",
        "1 - 2",
        "Clm",
        "",
        "R008",
        "D",
        "Kfn",
        "Vertretung",
        ""
      ],
      ["9a"],
      [
        "18.1.",
        "Mo",
        "9a, 9b, 9c",
        "EvR",
        "3 - 4",
        "Btz",
        "",
        "---",
        "EvR",
        "Btz",
        "Entfall",
        ""
      ],
      ["9b"],
      [
        "18.1.",
        "Mo",
        "9a, 9b, 9c",
        "EvR",
        "3 - 4",
        "Btz",
        "",
        "---",
        "EvR",
        "Btz",
        "Entfall",
        ""
      ],
      ["9c"],
      [
        "18.1.",
        "Mo",
        "9a, 9b, 9c",
        "EvR",
        "3 - 4",
        "Btz",
        "",
        "---",
        "EvR",
        "Btz",
        "Entfall",
        ""
      ],
      ["10a"],
      [
        "18.1.",
        "Mo",
        "10a, 10b, 10c",
        "EvR",
        "1 - 2",
        "Btz",
        "",
        "---",
        "EvR",
        "Btz",
        "Entfall",
        ""
      ],
      [
        "18.1.",
        "Mo",
        "10a",
        "Mu",
        "5",
        "Tr�",
        "",
        "MuS",
        "Mu",
        "Kfn",
        "Vertretung",
        ""
      ],
      ["10b"],
      [
        "18.1.",
        "Mo",
        "10a, 10b, 10c",
        "EvR",
        "1 - 2",
        "Btz",
        "",
        "---",
        "EvR",
        "Btz",
        "Entfall",
        ""
      ]
    ]
  },
  {
    "date": "2021-01-15T16:33:00.000Z",
    "dateString": "15.01.2021 17:33",
    "table": [
      [
        "Datum",
        "Tag",
        "Klasse(n)",
        "Fach",
        "Stunde",
        "Lehrer",
        "Text",
        "Raum",
        "(Fach)",
        "Grund: (Lehrer)",
        "Art",
        "Vertr. von / verlegt"
      ],
      ["10c"],
      [
        "18.1.",
        "Mo",
        "10a, 10b, 10c",
        "EvR",
        "1 - 2",
        "Btz",
        "",
        "---",
        "EvR",
        "Btz",
        "Entfall",
        ""
      ],
      ["Jg2"],
      [
        "18.1.",
        "Mo",
        "Jg2",
        "er",
        "8 - 9",
        "Btz",
        "",
        "---",
        "er",
        "Btz",
        "Entfall",
        ""
      ]
    ]
  }
]
```
