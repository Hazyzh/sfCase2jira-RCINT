import gulp from 'gulp';
import zip from 'gulp-zip';
import fs from 'fs-extra';
import webpack from 'webpack';

export async function createProcess(isDev) {
  const env = isDev ? 'development' : 'production';
  process.env.BABEL_ENV = env;
  process.env.NODE_ENV = env;

  const configFactory = require('./config/webpack.config');
  const config = configFactory(env);
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.info(err);
        // return;
      }
      console.log(
        '[webpack:buildExtension]',
        stats.toString({
          colors: true,
        }),
        new Date(),
      );
      resolve();
    })
  })
}

async function clean() {
  return fs.remove('./build');
}

async function copyTmp() {
  return  gulp
    .src(`./tmp/**`)
    .pipe(gulp.dest(`./build`))
}

const init = gulp.series(
  clean,
  copyTmp
)

export async function start() {
  await init();
  
  return createProcess(true);
}

async function buildZip() {
  return gulp.src('./build/**')
    .pipe(zip('build.zip'))
    .pipe(gulp.dest('./buildFile/'))
}

export async function build() {
  await init();
  await createProcess();
  return await buildZip();
}