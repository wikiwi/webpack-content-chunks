# webpack-content-chunks

A solution for adding webpack content chunks to the server response.

[![NPM Version Widget]][npm version]
[![Build Status Widget]][build status]
[![Coverage Status Widget]][coverage status]

## TOC

<!-- toc -->

- [Installation](#installation)
- [Use Case](#use-case)
- [Example](#example)
- [How it works](#how-it-works)
- [Troubleshooting](#troubleshooting)
  * [Where to get `stats.json`](#where-to-get-statsjson)
  * [My `stats.json` is huge!](#my-statsjson-is-huge)
  * [`__filename` always returns /index.js](#__filename-always-returns-indexjs)
- [API Reference](#api-reference)
  * [`WebpackContentChunks`](#webpackcontentchunks)
    + [`constructor(stats: Object)`](#constructorstats-object)
    + [`addChunksFrom(moduleName: string, codeSplit: number)`](#addchunksfrommodulename-string-codesplit-number)
    + [`getFiles(): Array<string>`](#getfiles-arraystring)
    + [`reset()`](#reset)
- [Contributions](#contributions)

<!-- tocstop -->

## Installation

```sh
npm install webpack-content-chunks --save
```

## Use Case

You already have an universal (isomorphic) app with server side rendering,
routing, and code splitting using webpack. To avoid unnecessary round trips
you want to optimize and include all content chunks to the server response.

## Example

_This is not a fully functional example and serves as a demonstration of the
concept. It uses ES6 (webpack2), but would work with `require`, and `require.ensure`
as well._

```javascript
import * as fs from "fs";
import { WebpackContentChunks } from "webpack-content-chunks";

const stats = JSON.parse(fs.readFileSync("./stats.json", "utf8"));

function middleware(req, res) {
  const contentChunks = new WebpackContentChunks(stats);

  matchRoutes(req.url, contentChunks);
  matchMoreRoutes(req.url, contentChunks);

  const chunks = contentChunks.getFiles().filter(path => path.endsWith(".js"))
    .map(filename => `<script src="/${filename}" />`);

  res.send(`<html><body><script src="/main.js" />${chunks}</body></html>`);
}

function matchRoutes(url, contentChunks) {
  switch(url) {
    case "/home":
      // First code split in file.
      contentChunks.addChunksFrom(__filename, 0);
      System.import("./home").then(() => { /* ... */ });
      break;
    case "/contact":
      // Second code split in file.
      contentChunks.addChunksFrom(__filename, 1);
      System.import("./contact").then(() => { /* ... */ });
      break;
  }
}

function matchMoreRoutes(url, contentChunks) {
  switch(url) {
    case "/article":
      // Third code split in file.
      contentChunks.addChunksFrom(__filename, 2);
      Promise.all([System.import("./module1"), System.import("./module2")])
        .then(([module1, module2]) => { /* ... */ });
      break;
  }
}
```

## How it works

_webpack-content-chunks_ uses webpack stats to gather information about existing
chunks. It then groups content chunks originating from the same line of code together
as a single `code split`.

## Troubleshooting

### Where to get `stats.json`

Use the [webpack-stats-plugin](https://github.com/FormidableLabs/webpack-stats-plugin).
We recommend the following config:

```javascript
new StatsWriterPlugin({
  filename: "stats.json",
  fields: ["chunks"],
  transform: (data) => {
    const result = { chunks: [] };
    for (const c of data.chunks) {
      const entry = {
        files: c.files,
        origins: [],
      };
      for (const origin of c.origins) {
        delete origin.module;
        delete origin.moduleIdentifier;
        entry.origins.push(origin);
      }
      result.chunks.push(entry);
    }
    return JSON.stringify(result, null, 2);
  },
}),
```

If you are using the `webpack-dev-middleware` follow this [instruction](https://github.com/webpack/webpack-dev-middleware#server-side-rendering).

### My `stats.json` is huge!

Use [webpack-stats-plugin](https://github.com/FormidableLabs/webpack-stats-plugin) see [where to get stats.json](#where-to-get-statsjson).

### `__filename` always returns /index.js

It seems you are using webpack for you server side code. In this case
you need to [tell webpack](https://webpack.github.io/docs/api-in-modules.html#__filename) to passthrough `__filename`.

```javascript
node: {
  __filename: true,
}
```

## API Reference

### `WebpackContentChunks`

A class for adding content chunks and retrieving files from added chunks.

#### `constructor(stats: Object)`

**Parameters**

-   `stats`: **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** - Webpack stats.

#### `addChunksFrom(moduleName: string, codeSplit: number)`

Adds all content chunks that originated from the nth-codesplit in
given module.

**Parameters**

-   `moduleName`: **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - Name of module, can be obtained using node's \_\_filename feature.
-   `codeSplit`: **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - Defines nth-codesplit starting at 0.

#### `getFiles(): Array<string>`

Returns an array of files from added chunks.

Returns: **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** - Array of files.

#### `reset()`

Resets instance as if no chunks has been added.

## Contributions

Contributions welcome! Make sure to pass `$ npm run test` and run `$ npm run docs` when your changes affects the documentation.

[npm version]: https://www.npmjs.com/package/webpack-content-chunks

[npm version widget]: https://img.shields.io/npm/v/webpack-content-chunks.svg?style=flat-square

[build status]: https://travis-ci.org/wikiwi/webpack-content-chunks

[build status widget]: https://img.shields.io/travis/wikiwi/webpack-content-chunks/master.svg?style=flat-square

[coverage status]: https://coveralls.io/github/wikiwi/webpack-content-chunks?branch=master

[coverage status widget]: https://img.shields.io/coveralls/wikiwi/webpack-content-chunks/master.svg?style=flat-square
