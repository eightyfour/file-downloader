/**
 * Created by eightyfour on 07.10.15.
 */
var config = require('./package').config.upload,
    downloader = require('./lib/downloader.js'),
    clc = require('cli-color');

console.log('app:config', config);

if (config) {
    downloader.load(config, __dirname, function () {
        console.log('Download complete');
    });
    downloader.onError(function (ulr) {
        console.log(clc.red.bold('Failure ') + clc.yellow('Download failed for file'), clc.yellowBright(ulr));
    })
}
