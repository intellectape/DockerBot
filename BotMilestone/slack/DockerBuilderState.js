var fs = require('fs');
var Docker = require('dockerode');
var deployAWS = require('./DeployAWS.js');

function DockerBuilderState() {
    subState = false;
}

var content = 'FROM python:2.7-slim\nWORKDIR /app\nADD . /app\n';
var startFile = null;
var subState = false;


DockerBuilderState.prototype.doAction = function(message, arguments, successReply, errorReply, intermediateReply) {
    if (subState) {
        doFinalAction(message, arguments, successReply, errorReply, intermediateReply);
        return;
    }
    if (fs.existsSync('/tmp/hello/' + message)) {
        startFile = 'CMD [ "python", "./' + message + '" ]';
        intermediateReply("Great!!...We found this file", function() {
            if (fs.existsSync('/tmp/hello/requirements.txt')) {
                intermediateReply("We found requirements.txt in your project, Dependencies will be resolved automatically", function() {
                    startFile = 'RUN pip install -r requirements.txt\n' + startFile;
                    intermediateReply("Do you want to add any other pip dependencies?. If yes, Please provide comma separated depencies, Else type - no");
                    subState = true;
                });

            } else {
                intermediateReply("Note - We didn't find requirements.txt in your project, Dependencies may not get resolved", function() {
                    intermediateReply("Do you want to add any other pip dependencies?. If yes, Please provide comma separated depencies, Else type - no");
                    subState = true;
                });
            }
        });
    } else {
        errorReply(message + " file not found, Please provide absolute path");
    }
};

function buildDockerImage(pathToDockerFile, intermediateReply, successReply) {
    intermediateReply("Please wait... While we try to build the image");
    setTimeout(function() {
        intermediateReply("Successfully created the docker image", function() {
            successReply("Please provide AWS Access ID:");
        })
    }, 1000);
}

DockerBuilderState.prototype.getNextState = function() {
    return new deployAWS.GetAccessKeyState();
};

function doFinalAction(message, arguments, successReply, errorReply, intermediateReply) {
    var finalBuild = function() {
        if (message === 'no' || message.trim() === '') {
            content = content + startFile;
        } else {
            var arr = message.split(",").map(function(item) {
                return item.trim();
            });
            for (var item in arr) {
                content += "RUN pip install " + arr[item] + "\n";
            }
            content = content + startFile;
        }
        intermediateReply(message === 'no' ? "No additional dependencies added" : "Additional dependencies successfully added", function() {
            fs.writeFile("/tmp/hello/Dockerfile", content, function(err) {
                intermediateReply("Successfully created docker file.", function() {
                    buildDockerImage("/tmp/hello/Dockerfile", intermediateReply, successReply);
                })
            });
        })

    };
    finalBuild();
}

function isFileExists() {

}

module.exports = DockerBuilderState;