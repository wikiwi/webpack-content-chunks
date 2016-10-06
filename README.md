# webpack-initial-chunks

A solution for adding webpack initial chunks to the server response.

[![Build Status Widget]][Build Status]
[![Coverage Status Widget]][Coverage Status]

[Build Status]: https://travis-ci.org/wikiwi/webpack-initial-chunks
[Build Status Widget]: https://travis-ci.org/wikiwi/webpack-initial-chunks.svg?branch=master
[Coverage Status]: https://coveralls.io/github/wikiwi/webpack-initial-chunks?branch=master
[Coverage Status Widget]: https://coveralls.io/repos/github/wikiwi/webpack-initial-chunks/badge.svg?branch=master

# API

## `WebpackInitialChunks`

A class for adding chunks and retrieving files from added chunks.

### `constructor(stats: Object)`

**Parameters**

-   `stats`: **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** - Webpack stats.

### `addChunksFrom(moduleName: string, occurrence: number)`

Adds all chunks that originated from the nth-codesplit in
given module.

**Parameters**

-   `moduleName`: **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - Name of module, can be obtained using node's \_\_filename feature.
-   `occurrence`: **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - Defines nth-codesplit starting at 0.

### `getFiles(): Array<string>`

Returns an array of files from all added chunks.

Returns: **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** - Array of files.

### `reset()`

Resets instance as if no chunks has been added.
