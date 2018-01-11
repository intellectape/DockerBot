var url = require('url');
var git = require('./Git');
var DockerBuilderState = require('./DockerBuilderState');

function GithubState() {

}

GithubState.prototype.doAction = function (message, arguments, successReply, errorReply, intermediateReply) {
    message = message.substring(1, message.length - 1);
    intermediateReply("Please wait.. while I process your repo.", function () {
        git.performGitClone(message, function (error) {
            errorReply(error);
        }, function () {
            intermediateReply("We have successfully processed your repository", function () {
                successReply("Please tell us your startup file name [Note just provide filename like 'app.py']");
            });
        });
    })
};


GithubState.prototype.getNextState = function () {
    return new DockerBuilderState();
};

module.exports = GithubState;

