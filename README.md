# file-downloader
Download files from a server and saves it locally. 

The *destFolder* property defines the local path and the *urls* property expects an array of URL strings.
```javascript
   var downloader = require('file-downloader');
   
   downLoader.load([
        {
            "destFolder": "images",
            "urls": ["url path"]
        }
     ])
```

### rename
or pass an object instead of an string to rename the downloaded file
```javascript
   var downloader = require('file-downloader');
   
   downLoader.load([
        {
           "destFolder": "images",
           "urls": [{
               "url": "url path",
               "rename": "newFileName.jpg"
             }]
         }
     ])
```

### singleFolder
optional you can also activate the "singleFolder" flag and each file will be saved in a separate folder with 
the file name (without the extension) as folder name.
```javascript
   var downloader = require('file-downloader');
   
   downLoader.load([
        {
           "destFolder": "images",
           "singleFolder" : true,
           "urls": ["url path"]
         }
     ])
```