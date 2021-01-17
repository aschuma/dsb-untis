# DSB crawler and Untis's HTML parser

## Basic Usage

```
const DsbUntis = require('dsb-untis')

const username = "165931";
const password = "secret";

const client = new DsbUntis(username, password);
client.fetch().then((data) => { 
    console.log(JSON.stringify(data))
});
```

## Example result

```
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
