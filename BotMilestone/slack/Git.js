var Git = require('nodegit');
const exec = require('child_process').exec;

function performGitClone(urlPath, error, success) {
    exec('rm -rf /tmp/hello', function (error, std, ss) {
        Git.Clone(urlPath, "/tmp/hello")
            .then(function (repo) {
                success();
            })
            .catch(function (err) {
                error(err);
            });
    });
    
}

module.exports.performGitClone = performGitClone;