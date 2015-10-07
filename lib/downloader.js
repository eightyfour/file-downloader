var fs = require('fs'),
    request = require('request'),
    mkdirP = require('./mkdir-p'),
    onErrorQueue = [];


function callOnError(urlName) {
    onErrorQueue.forEach(function (fc) {
        fc(urlName);
    })
}
/**
 * add a / at the beginning or end
 * @param folder
 * @returns {*}
 */
function formatFolder(folder) {
    if (folder === undefined || folder.length === 0) {
        return '/';
    }
    // replace all spaces with underscores
    folder = folder.split(' ').join('_');

    if (folder[folder.length] !== '/') {
        folder += '/';
    }
    if (folder[0] !== '/') {
        folder = '/' + folder;
    }
    return folder;
}
/**
 * Downloads all files and saves them in the destination folder with the passed files name
 * @param destFolder
 * @param urls []
 */
function loadFilesToFolder(destFolder, urls) {

    urls.forEach(function (url) {
        var split,
            fileName,
            urlSrc,
            err = false;

        if (url.hasOwnProperty('rename')) {
            fileName = url.rename;
            urlSrc = url.url;
        } else {
            split = url.split('/');
            fileName = split[split.length - 1];
            urlSrc = url;
        }
        request
            .get(urlSrc)
            .on('response', function(response) {
                if (response.statusCode !== 200) {
                    err = true;
                    callOnError(urlSrc);
                    console.error("download failed for url:", urlSrc);
                } else {
                    response.pipe(fs.createWriteStream(destFolder + fileName));
                }
            })
    })
}
module.exports = {
    /**
     * Loads files from a URL and saves this on local storage.
     *
     * @param config [{
     *   "destFolder": "", (default "/")
     *   "urls": [ "String" | {Object {url:"String", rename:"String"} } ]
     *  }]
     * @param rootFolder
     */
    load : function (config, rootFolder) {
        config.forEach(function (obj) {
            var destFolder = formatFolder(obj.destFolder);
            console.log('uploader:obj.destFolder', destFolder);

            mkdirP(rootFolder, destFolder, function () {
                loadFilesToFolder(rootFolder + destFolder, obj.urls)
            })
        })
    },
    /**
     * A error callback can be registered - If a image could not be loaded it will call the callback
     * with the none existing URL.
     * @param fc -> (URL)
     */
    onError : function (fc) {
        onErrorQueue.push(fc);
    }
};