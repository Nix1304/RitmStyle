import { src, dest, parallel, watch, series } from 'gulp';
import browserSync from 'browser-sync';

import sassCompiller from 'node-sass';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import minHTML from'gulp-htmlmin';


const paths = {
    dist: './dist',
    src: './src',
};
const srcPaths = {
    html: `${paths.src}/templates/*.html`,
    sass: `${paths.src}/sass/*.sass`,
    img: `${paths.src}/images/*`,
    fonts: `${paths.src}/fonts/*`
};
const distPaths = {
    html: `${paths.dist}/`,
    css: `${paths.dist}/styles`,
    img: `${paths.dist}/images`,
    fonts: `${paths.dist}/fonts`
};


const browserSyncInit = (done) => {
    browserSync.init({
        server: {
            baseDir: paths.dist,
        },
        host: 'localhost',
        port: 9000,
        logPrefix: 'log',
    });
    done();
}
const browserSyncReload = (done) => {
    browserSync.reload();
    done();
}


const css = async () => {
    src(srcPaths.sass)
        .pipe(sass(sassCompiller)())
        .pipe(cleanCSS())
        .pipe(dest(distPaths.css));
}

const html = async () => {
    src(srcPaths.html)
        .pipe(minHTML({ collapseWhitespace: true }))
        .pipe(dest(distPaths.html));
}

const img = async () => {
    src(srcPaths.img)
        .pipe(dest(distPaths.img));
}

const fonts = async () => {
    src(srcPaths.fonts).pipe(dest(distPaths.fonts));
}

const watchFiles = async () => {
    watch(srcPaths.html, html);
    watch(srcPaths.sass, css);
    watch(srcPaths.img, img);
    // watch(srcPaths.fonts, series(fonts, browserSyncReload))
}

const build = parallel(css, html, img, fonts);
const watchTask = parallel(build, watchFiles)

export { watchTask as watch, build };
export default build;
