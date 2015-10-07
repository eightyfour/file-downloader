var fs = require('fs');


modules.export = {
    upload : function (config) {
        config.forEach(function (obj) {
            console.log('uploader:obj.destFolder', obj.destFolder);
            obj.upload.forEach(function (url) {

            })

        })
    }
}