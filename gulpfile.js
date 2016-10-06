const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const jsonlint = require("gulp-jsonlint");
const eslint = require("gulp-eslint");
const merge = require("merge2");

gulp.task("es6", ["lint"], () => {
  const tsProject = ts.createProject("tsconfig.json", {
    declaration: true,
    target: "es6",
    module: "es6",
  });
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest("dist/")),
    tsResult.js.pipe(gulp.dest("dist/es6")),
  ]);
});

gulp.task("esm", ["lint"], () => {
  const tsProject = ts.createProject("tsconfig.json", {
    declaration: true,
    target: "es5",
    module: "es6",
  });
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest("dist/")),
    tsResult.js.pipe(gulp.dest("dist/esm")),
  ]);
});

gulp.task("commonjs", ["lint"], () => {
  const tsProject = ts.createProject("tsconfig.json", {
    declaration: true,
    target: "es5",
    module: "commonjs",
  });
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest("dist/")),
    tsResult.js.pipe(gulp.dest("dist/commonjs")),
  ]);
});

gulp.task("tslint", () => {
  return gulp.src("./src/**/*.ts")
    .pipe(tslint({
      formatter: "verbose",
    }))
    .pipe(tslint.report());
});

gulp.task("eslint", () => {
  return gulp.src("./*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("jsonlint", () => {
  return gulp.src("./*.json")
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task("lint", ["jsonlint", "eslint", "tslint"]);
gulp.task("default", ["lint", "commonjs", "esm", "es6"]);
