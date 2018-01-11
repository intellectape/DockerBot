const exec = require('child_process').exec;
var mock = require("mock-fs");
var fs = require("fs");

fs1 = {
    "/tmp/hello/": {"app.py": "print('Hello Word')", "requirements.txt": ""}
};

fs0 = {
    "/tmp/hello/": {"test.py": "print('Hello Word')"}
};
var dictionary = {"https://github.com/CSC-510/Mocking": fs0, "https://github.com/karanchaudhri/flask-examples": fs1};

var json = {"https://github.com/karanchaudhri/flask-examples": ""};

function performGitClone(urlPath, error, success) {
    exec('rm -rf /tmp/hello', function (erro, std, ss) {

        if (urlPath in dictionary) {
            mock(dictionary[urlPath]);
            success();
        } else {
            error("Repo Not Found");
        }
    });
}

module.exports.performGitClone = performGitClone;