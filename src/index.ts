/*
 * Copyright (C) 2016 Chi Vinh Le and contributors.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/**
 * A class for adding content chunks and retrieving files from added chunks.
 */
export class WebpackContentChunks {
  private modules: { [filename: string]: Module };
  private files: string[];

  /**
   * @param {Object} stats - Webpack stats.
   */
  constructor(stats: any) {
    this.modules = {};
    this.files = [];
    this.analyzeStats(stats);
  }

  /**
   * Adds all content chunks that originated from the nth-codesplit in
   * given module.
   * @param {string} moduleName - Name of module, can be obtained using node's __filename feature.
   * @param {number} codeSplit - Defines nth-codesplit starting at 0.
   */
  public addChunksFrom(moduleName: string, codeSplit: number): void {
    if (moduleName.substr(0, 2) !== "./") {
      moduleName = "./" + moduleName;
    }
    const files = this.modules[moduleName].codeSplits[codeSplit].files;
    this.files.push(...files);
  }

  /**
   * Returns an array of files from added chunks.
   * @returns {string[]} - Array of files.
   */
  public getFiles(): string[] {
    return this.files;
  }

  /**
   * Resets instance as if no chunks has been added.
   */
  public reset(): void {
    this.files = [];
  }

  private analyzeStats(stats: any): void {
    for (const chunk of stats.chunks) {
      for (const origin of chunk.origins) {
        const { moduleName } = origin;
        const line = origin.loc.split(":")[0];
        if (!this.modules[moduleName]) {
          this.modules[moduleName] = new Module();
        }
        this.modules[moduleName].add(chunk.files, line);
      }
    }
  }
}

interface CodeSplit {
  files: string[];
  line: number;
}

class Module {
  public codeSplits: CodeSplit[];

  constructor() {
    this.codeSplits = [];
  }

  public add(files: string[], line: number): void {
    for (const cs of this.codeSplits) {
      if (cs.line === line) {
        cs.files.push(...files);
        return;
      }
    }
    this.codeSplits.push({ files: files.slice(), line });
  }
}
