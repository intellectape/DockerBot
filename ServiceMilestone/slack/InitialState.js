var GithubState = require('./GithubState');


function InitialState() {

}

InitialState.prototype.doAction = function(message, arguments, successReply, errorReply, intermediateReply) {
    successReply("Hello, To Start Using this bot - Please provide me with valid github url");
};

InitialState.prototype.getNextState = function() {
    return new GithubState();
};

module.exports = InitialState;