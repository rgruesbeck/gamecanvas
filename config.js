var fs = require('fs');

var buildConfig = require('./.koji/scripts/buildConfig.js');
var config = buildConfig();

fs.writeFileSync('config.json', config);

var buildManifest = require('./.koji/scripts/buildManifest.js');
var manifest = buildManifest();

fs.writeFileSync('manifest.webmanifest', manifest);