/**
 * Created by eightyfour on 07.10.15.
 */
var config = require('./package').config.upload,
    downloader = require('./lib/downloader.js');

console.log('app:config', config);

if (config) {

    downloader.load(config, __dirname);
    downloader.onError(function (ulr) {
        console.log('app:onError', ulr);
    })
}
