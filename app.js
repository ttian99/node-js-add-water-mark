var images = require('images');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

// var watermarkImg = images(path.join(__dirname, 'org/watermark.png'));
// var sourceImg = images(path.join(__dirname, 'org/dashu.png'));
// var savePath = path.join(__dirname, 'out/saveImg.png');
// // 比如放置在右下角，先获取原图的尺寸和水印图片尺寸
// var sWidth = sourceImg.width();
// var sHeight = sourceImg.height();
// var wmWidth = watermarkImg.width();
// var wmHeight = watermarkImg.height();
// images(sourceImg)
//     // 设置绘制的坐标位置，右下角距离 10px
//     .draw(watermarkImg, sWidth - wmWidth - 10, sHeight - wmHeight - 10)
//     // 保存格式会自动识别
//     .save(savePath);


/** 是否为文件夹 */
function isDir(filePath) {
    return fs.lstatSync(filePath).isDirectory();
}
/** 是否为文件 */
function isFile(filePath) {
    return fs.lstatSync(filePath).isFile();
}

function addWaterMark(watermarkPath, srcPath, dstPath) {
    if (isFile(srcPath)) {
        var watermarkImg = images(watermarkPath);
        var srcImg = images(srcPath);
        var baseName = path.basename(srcPath);
        var outPath = path.join(dstPath, baseName)
        addOneImg(watermarkImg, srcImg, outPath);
    } else {
        console.log('dirPath = ' + dirPath);
        var dirPath = path.join(srcPath, '**.*');
        glob(dirPath, function (err, list) {
            if (err) {
                console.error('错误');
                console.error(err);
                return;
            }

            console.log(list);
            for (var i = 0; i < list.length; i++) {
                var watermarkImg = images(watermarkPath);
                var filePath = list[i];
                console.log('filePath = ' + filePath);
                var srcImg = images(filePath);
                var baseName = path.basename(filePath);
                var outPath = path.join(dstPath, baseName);

                console.log('outPath = ' + outPath);
                // setTimeout(function() {
                addOneImg(watermarkImg, srcImg, outPath);
                // }, 500);
            }
        });
    }
}


/**
 * 
 * 横向比例标准模板
 * 1548 x 1052
 * 350 x 210
 * dw = 350 / 1548;
 * dh = 210 / 1052;
 * 
 * 纵向比例标准模板
 * 
 * 
 * */
function addOneImg(watermarkImg, srcImg, dstPath) {
    // 获取原始图片尺寸
    var sWidth = srcImg.width();
    var sHeight = srcImg.height();
    // var wmWidth = watermarkImg.width();
    // var wmHeight = watermarkImg.height();
    var dw = 350 / 1548; // width比例: 水印图片宽度/目标图片宽度
    var dh = 210 / 1052; // height比例: 水印图片高度/目标图片高度
    var x = 0; //水印x位置
    var y = 0; //水印y位置
    // 是否为竖照片
    var isPortrait = sHeight / sWidth > 1; 
    console.log(`是${isPortrait ? '竖' : '横'}照片`);


    if (isPortrait) {
        dw = 30 / 100;
    } else {
        dw = 26 / 100;
    }

    // 调整水印大小
    var newWidth = dw * sWidth;
    watermarkImg.resize(newWidth);
    // 获取水印大小
    var wmWidth = watermarkImg.width();
    var wmHeight = watermarkImg.height();

    if (isPortrait) {
        x = 150;
        y = sHeight - wmHeight - 80;
    } else {
        x = 250;
        y = sHeight - wmHeight - 80;
    }

    images(srcImg)
        // .draw(watermarkImg, sWidth - wmWidth - 10, sHeight - wmHeight - 10)
        .draw(watermarkImg, x, y)
        .save(dstPath)
}



var WM_PATH = path.join(__dirname, 'watermark/2.png');
var SRC_PATH = path.join(__dirname, 'src');
var DST_PATH = path.join(__dirname, 'out');

try {
    addWaterMark(WM_PATH, SRC_PATH, DST_PATH);
} catch (error) {
    throw error;
}