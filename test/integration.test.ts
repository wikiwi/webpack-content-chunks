/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
import { WebpackInitialChunks } from "../src/index";
import { assert } from "chai";
import * as fs from "fs";

describe("integration test", () => {
  let instance: WebpackInitialChunks;
  let stats: any;

  before(() => {
    stats = JSON.parse(fs.readFileSync("./test/fixture/stats.json", "utf8"));
  });

  beforeEach(() => {
    instance = new WebpackInitialChunks(stats);
  });

  it("should initially return an empty file list", () => {
    const files = instance.getFiles();
    assert.lengthOf(files, 0);
  });

  it("should return files of chunks from a code split resulting in a single chunk", () => {
    instance.addChunksFrom("./src/modules/singlechunk/routes.ts", 0);
    const files = instance.getFiles();
    assert.deepEqual(files, ["3.app.js", "3.app.js.map"]);
  });

  it("should return files of chunks from a code split resulting in multilpe chunks", () => {
    instance.addChunksFrom("./src/modules/multiplechunks/routes.ts", 0);
    const files = instance.getFiles().sort();
    assert.deepEqual(files, ["0.app.js", "0.app.js.map", "2.app.js", "2.app.js.map"]);
  });

  it("should return chunk files depending on code split occurrence", () => {
    instance.addChunksFrom("./src/modules/multiplesplits/routes.ts", 1);
    const files = instance.getFiles().sort();
    assert.deepEqual(files, ["0.app.js", "0.app.js.map", "1.app.js", "1.app.js.map", "4.app.js", "4.app.js.map"]);
  });

  it("should return union of chunk files when adding chunks from multiple code splits", () => {
    instance.addChunksFrom("./src/modules/singlechunk/routes.ts", 0);
    instance.addChunksFrom("./src/modules/multiplechunks/routes.ts", 0);
    const files = instance.getFiles().sort();
    assert.deepEqual(files, ["0.app.js", "0.app.js.map", "2.app.js", "2.app.js.map", "3.app.js", "3.app.js.map"]);
  });

  it("should reset files", () => {
    instance.addChunksFrom("./src/modules/singlechunk/routes.ts", 0);
    instance.reset();
    const files = instance.getFiles();
    assert.lengthOf(files, 0);
  });

  it("should handle relative files without ./ prefix", () => {
    instance.addChunksFrom("src/modules/multiplechunks/routes.ts", 0);
    const files = instance.getFiles().sort();
    assert.deepEqual(files, ["0.app.js", "0.app.js.map", "2.app.js", "2.app.js.map"]);
  });

  it("should throw when adding chunks form unknown code splits", () => {
    const willThrow = () => instance.addChunksFrom("./src/modules/multiplechunks/routes.ts", 3);
    assert.throws(willThrow);
  });

  it("should throw when adding chunks form unknown modules", () => {
    const willThrow = () => instance.addChunksFrom("./src/modules/unknown/routes.ts", 0);
    assert.throws(willThrow);
  });
});
