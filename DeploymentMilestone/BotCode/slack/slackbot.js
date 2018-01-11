var Botkit = require('botkit');
var request = require('request');
var _ = require('underscore');

var notificationChannels = ["dockercreation"];
var sendAsUser = false;
var botName = "dockerBot";

var tokenLoader = require('./tokenLoader');
const TOKEN = tokenLoader.getToken();
var InitialState = require('./InitialState');

//AWS.config.loadFromPath('./aws-config.json');

var controller = Botkit.slackbot({
    debug: false
});

var readyPromise = new Promise(function(resolve, reject) {
    console.log("promising...");
    controller.spawn({
        token: TOKEN,
    }).startRTM(function(err) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

var prevState = new InitialState();
var state = new InitialState();
var lastReply = "Please provide a valid github Url.";

controller.on(['mention', 'direct_mention', 'direct_message'], function(bot, data) {
    var message = data.text;
    var command;
    var argument;
    _.each(commands, function(commandObj) {
        if (message.includes(commandObj.name)) {
            command = commandObj;
            var commandStart = message.toLowerCase().indexOf(command.name + " ");
            if (commandStart != -1) {
                // +1 accounts for space after command
                var argStart = commandStart + command.name.length + 1;
                argument = message.substr(argStart).toLowerCase().trim();
            }
        }
    });

    if (message === 'reset') {
        state = new InitialState();
    }

    if (message === 'exit') {
        bot.reply(data, "Bye");
        state = new InitialState();
    }
    state.doAction(message, arguments, function(reply) {
        lastReply = reply;
        bot.reply(data, reply);
        state = state.getNextState();
    }, function(error) {
        bot.reply(data, error);
    }, function(intermediateReply, cb) {
        bot.reply(data, intermediateReply, function(err, res) {
            if (cb) {
                cb();
            }
        });
    });

});


var commands = [
    { name: "list images", expectsArg: false },
    { name: "add aws", expectsArg: true },
    { name: "get token", expectsArg: true },
    { name: "check image", expectsArg: true },
    { name: "create image", expectsArg: true },
    { name: "delete image", expectsArg: true },
    { name: "deploy project", expectsArg: true }
];


function getCommands() {
    var commandsMessage = "Here are your options. To see them again, type 'help'.\n\n";
    commandsMessage += "To add AWS RegistryID (i.e. User ID), type \'add aws <aws-id> <aws-region>\'.\n";
    commandsMessage += "To check whether a docker image is in the AWS, type \'check image <image-name>\'.\n";
    commandsMessage += "To create a docker image, type \'create image <image-name>\'.\n";
    commandsMessage += "To list docker images, type \'list images\'.\n";
    commandsMessage += "To delete a docker image, type \'delete image <image-name>\'.\n";
    commandsMessage += "To deploy a project on docker image, type \'deploy project <image-name> <project-git-repo>\'.\n";
    return commandsMessage;
}