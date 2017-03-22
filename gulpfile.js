/*!
 * gulp
 * $
   cnpm install gulp gulp-sass  gulp-autoprefixer gulp-minify-css gulp-htmlmin gulp.spritesmith gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename browser-sync gulp-cache --save-dev
 */
// 加载各个模块
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    //less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    spritesmith = require('gulp.spritesmith'),
    //jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin');
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;
// sass编译
gulp.task('sass', function() {
    return gulp.src(['src/scss/*.scss','!src/scss/color.scss','!src/scss/mixins.scss','!src/scss/reset.scss','!src/scss/box.scss'])
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        //.pipe(notify({ message: 'sass编译完成' }));
});
// 图片压缩
gulp.task('images', function() {
    return gulp.src('src/images/*')
           .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
           .pipe(gulp.dest('dist/images'))
});
//雪碧图  在sass images 任务完成后合并雪碧图
gulp.task('sprite',[], function () {
    return gulp.src('src/images/{*title*,*zan*,*btn*,*lottery_img*}.{jpg,png}')
            .pipe(spritesmith({
                imgName: 'dist/images/sprite.png',
                cssName: 'dist/css/sprite.css',
                algorithm:'top-down',
            }))
            .pipe(gulp.dest(''));
});
//css合并
gulp.task('css',['sass'], function() {
    return gulp.src(['src/css/*.css'])
           //.pipe(concat('concat.css'))
           .pipe(minifycss())
           //.pipe(rename({ suffix: '.min' }))
           // .pipe(autoprefixer({
           //      browsers:['last 4 versions'],
           //      cascade:true,//是否美化属性值 默认：true 像这样：
           //      //-webkit-transform:rotate(45deg);//transform:rotate(45deg);
           //      remove:true//是否去掉不必要的前缀 默认：true
           //  }))
           //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
           .pipe(gulp.dest('dist/css'))
           .pipe(reload({stream: true}))
           //.pipe(notify({ message: 'css合并压缩完成' }));
});
// js合并压缩
gulp.task('js', function() {
    return gulp.src(['src/js/*.js'])
            //.pipe(jshint())
            //.pipe(jshint.reporter('default'))
            .pipe(concat('concat.js'))
            //.pipe(rename({ suffix: '.min' }))
            //.pipe(uglify())
            .pipe(gulp.dest('dist/js'))
            .pipe(reload({stream: true}))
            //.pipe(notify({ message: 'JS task complete' }));
});
gulp.task('html',function(){
    var options = {
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    };
    gulp.src('src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'))
        .pipe(reload({stream: true}))
        //.pipe(notify({ message: 'html压缩完成' }));
});

gulp.task('server', function() {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch(['dist/*.html','dist/css/*.css','dist/js/*.js']).on('change', reload);
});
gulp.task('watch',['server'], function(){
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/css/*.css', ['css']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/images/*', ['images']);
    gulp.watch('src/*.html', ['html']);
})
// 默认任务
gulp.task('default', ['watch','server'], function() {
    gulp.start('sass', 'images', 'sprite','css', 'js', 'html');
});

