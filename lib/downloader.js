/**
 *
 */
var fs = require('fs'),
    request = require('request'),
    mkdirp = require('mkdirp'),
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
 * helper function to return the file name without the extension
 * @param fileName
 * @returns {string}
 */
function removeExtension(fileName) {
    var split = fileName.split('.');
    return split.splice(0, split.length - 1).join('.');
}

/**
 * Downloads all files and saves them in the destination folder with the passed files name
 * @param destFolder
 * @param urls []
 */
function loadFilesToFolder(destFolder, urls, singleFolder, cb) {
    var callback = cb || singleFolder,
        length = urls.length;

    function handleCallback() {
        length--;
        if (length <= 0) {
            callback();
        }
    }

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
                var folder = destFolder + fileName,
                    imgStream;

                if (response.statusCode !== 200) {
                    err = true;
                    callOnError(urlSrc);
                    handleCallback();
                } else {
                    if (singleFolder === true) {
                        // can't use the async function here - otherwise the stream will fail
                        mkdirp.sync(destFolder + removeExtension(fileName));
                        folder = destFolder + removeExtension(fileName) + '/' + fileName;
                    }
                    imgStream = fs.createWriteStream(folder);
                    imgStream.end(function () {
                        handleCallback();
                    });
                    response.pipe(fs.createWriteStream(folder));
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
    load : function (config, rootFolder, cb) {
        var length = config.length;
        function endCallBack() {
            length--;
            if (length <= 0) {
                cb && cb()
            }
        }

        config.forEach(function (obj) {
            var destFolder = formatFolder(obj.destFolder);

            mkdirp(rootFolder + destFolder, function () {
                if (obj.hasOwnProperty('singleFolder') && obj.singleFolder) {
                    loadFilesToFolder(rootFolder + destFolder, obj.urls, true, endCallBack);
                } else {
                    loadFilesToFolder(rootFolder + destFolder, obj.urls, endCallBack);
                }
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