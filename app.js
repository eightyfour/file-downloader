/**
 * Created by han on 07.10.15.
 */
var config = process.env.npm_package_config_upload,
    uploader = require('./lib/uploader.js');

uploader.upload(config);