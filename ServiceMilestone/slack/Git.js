var Git = require('nodegit');
const exec = require('child_process').exec;
var validUrl = require('valid-url');

function performGitClone(urlPath, errorFunction, success) {
    if (validUrl.isUri(urlPath)) {
        exec('rm -rf /tmp/hello', function (error, std, ss) {
            Git.Clone(urlPath, "/tmp/hello")
                .then(function (repo) {
                    success();
                })
                .catch(function (err) {
                    errorFunction("Unable to process this repository (Or Not Supported)...Please provide valid repo url");
                });
        });
    } else {
        errorFunction("Repo Not Found");
    }


}

module.exports.performGitClone = performGitClone;