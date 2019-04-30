var fs = require('fs');

var buildConfig = require('../.koji/scripts/buildConfig.js');
fs.writeFileSync('.internals/config.json', buildConfig());

var buildManifest = require('../.koji/scripts/buildManifest.js');
fs.writeFileSync('manifest.webmanifest', buildManifest());