/*
This javascript file contains the code for deployment logic written in AWS.
Addresses USE CASE 3
*/

// Loading Require Libraries
var AWS = require('aws-sdk');
var nock = require("./AWSMock.js"); // This file would be required to mock the bot behaviour for the user.
var Docker = require('dockerode');
var fs = require("fs");
const exec = require('child_process').exec;
var shell = require('shelljs');
var mocking = true;

// Setting default region from our side
var REGION = 'us-east-1';
var awsConfigFD;
var awsConfigData;
var parsedAWSConfig;

// Default Variables to be accessed throughout the program.
var ACCESS_KEY = '';
var SECRET_KEY = '';
var USER_ID = '';
var JSON_STRING = '';
var REPO_NAME = '';
var DOCKER_IMAGE_ID = '05a3bd381fc2';
var DOCKER_IMAGE = 'hello-world';
var aws_link = '';
var ecs = new AWS.ECS();
var ecr = new AWS.ECR();

//AWS.config.paramValidation = false;

// Function to configure all the AWS credentials for the AWS SDK
function configureAws() {

    if (!fs.existsSync('./aws-config.json')) {
        JSON_STRING = '{ "accessKeyId":"' + ACCESS_KEY + '", "secretAccessKey": "' + SECRET_KEY + '", "region": "us-east-1" }';
        fs.writeFile("./aws-config.json", JSON_STRING, function(err) {
            console.log("Updating AWS credentials...!");
        });
    }
    awsConfigFD = fs.openSync("./aws-config.json", 'r');
    awsConfigData = fs.readFileSync(awsConfigFD, 'utf-8');
    parsedAWSConfig = JSON.parse(awsConfigData);
    AWS.config.loadFromPath('./aws-config.json');
    return "AWS credentials successfully updated!";
}

// Function to fetch User ID from AWS for a set of Access Key and Secret
// Now stale as taking input from User.
function getUserID() {
    var intermediatMessage = configureAws();
    return intermediatMessage;
    /*var sts = new AWS.STS();
    USER_ID = sts.getCallerIdentity({}, function(err, data) {
        if (err) {
            console.log("Error", err);
            return null;
        } else {
            var accountData = JSON.stringify(data.Account);
            return accountData;
        }
    });*/
}

// Get Access Key State Region: To fetch the access key for the user
function GetAccessKeyState() {}

GetAccessKeyState.prototype.doAction = function(message, arguments, successReply, errorReply, intermediateReply) {
    if (message.length === 20) {
        ACCESS_KEY = message;
        successReply("Please enter the Secret Key:");
    } else {
        errorReply("Please enter a valid AccessKey");
    }

}

GetAccessKeyState.prototype.getNextState = function() {
    return new GetSecretKeyState();
}


// Get Secret Key State Region: To fetch the secret token for the user.
function GetSecretKeyState() {}

GetSecretKeyState.prototype.doAction = function(message, arguments, successReply, errorReply, intermediateReply) {
    if (message.length === 40) {
        SECRET_KEY = message;
        successReply("Please enter the User ID:");
    } else {
        errorReply("Enter a valid Secret Key");
    }
}

GetSecretKeyState.prototype.getNextState = function() {
    return new GetUserIdState();
}

// Function to check whether a user input Repo exists or not.
function checkImage(repo_name, callback) {

    if (mocking) {
        nock.mock_describeRepositories(repo_name);
    } else {
        configureAws();
    }
    var params = {};
    ecr.describeRepositories(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(data);
        } else {
            callback(data);
        }
    });
}

// Function to create a Repository if user have already not created the repo before
function createImage(repo_name, callback) {
    if (mocking) {
        nock.mock_createRepository(repo_name);
    }

    var params = {
        repositoryName: repo_name /* required */
    };

    ecr.createRepository(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback("Repository with name: " + repo_name + " cannot be created!");
        } else {
            callback("Repository with name: " + params.repositoryName + " was created!\n" + "URL for User Access: " + data.repository.repositoryUri);
            console.log(data); // successful response
        }
    });
}

// Get User ID State region: To fetch the User ID which is numeric for the user.
function GetUserIdState() {}
GetUserIdState.prototype.doAction = function(message, arguments, successReply, errorReply, intermediateReply) {
    if (message.length === 12) {
        var isnum = /^\d+$/.test(message);
        if (isnum) {
            USER_ID = message;
            //configureAws();
            var message = "USER ID: " + USER_ID;
            var message_access = "Access Key: " + ACCESS_KEY;
            var message_secret = "Secret Key: " + SECRET_KEY;
            intermediateReply("Your User Details are:" + message, function() {
                intermediateReply(message_access, function() {
                    intermediateReply(message_secret, function() {
                        intermediateReply("Awesome! We are all set and we shall key going!", function() {
                            successReply("Please Provide a Repo name where you want to deploy your image:");
                        });
                    });
                });
            });
        } else {
            errorReply("Enter User ID in numeric number.");
        }

    } else {
        errorReply("Enter a valid User ID.");
    }
}
GetUserIdState.prototype.getNextState = function() {
    return new GetDeployImageState();
}

// Get Deploy Image State Region: Deployment code for docker file exists here.
function GetDeployImageState() {}

GetDeployImageState.prototype.doAction = function(message, arguments, successReply, errorReply, intermediateReply) {
    if (message) {
        REPO_NAME = message;
        checkImage(REPO_NAME, function(reply) { // Checking the user input repo for checking if it exists or not.
            if (!reply) {
                createImage(REPO_NAME, function(response) { // Creating the repo from user input name if it doesn't exists.
                    intermediateReply(response);
                });
            } else {
                intermediateReply("Repository already exists, using it for deployment!");
            }
            // Deploying data to the docker container.
            intermediateReply("Deploying your Docker Image to AWS...", function() {
                var status = deployDocker();
                if (status == "Error") {
                    errorReply("Something went wrong!");
                } else {
                    successReply("Docker Image successfully deployed!");
                }
            });

        });
        //intermediateReply("Deploying your Docker Image to AWS...");
    } else {
        errorReply("Enter a valid Repo Name.");
    }
}
GetDeployImageState.prototype.getNextState = function() {
    return null;
}

// Function to register task definition while trying to deploy a docker image on the repository
function registerTaskDefinition() {
    if (mocking) {
        nock.mock_registerTaskDefinition(0);
    }
    var params = {
        containerDefinitions: [{
            name: REPO_NAME,
            cpu: 10,
            essential: true,
            image: aws_link,
            memory: 500
        }],
        family: REPO_NAME
    };
    ecs.registerTaskDefinition(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            return "Error";
        } else {
            console.log(data); // successful response
            return runTask();
        }
    });
}

// Function to run the docker image in the repository after pushing complete file on the repo.
function runTask() {
    if (mocking) {
        nock.mock_runTask(0);
    }
    var params = {
        taskDefinition: REPO_NAME
    };
    ecs.runTask(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            return "Error";
        } else {
            console.log(data); // successful response
            return "Docker Image up and running!";
        }
    });
}

// Function to deploy docker image on the AWS repository from user input.
function deployDocker(callback) {
    if (!mocking) {
        var docker = new Docker();
        aws_link = USER_ID + ".dkr.ecr." + AWS.config.region + ".amazonaws.com/" + REPO_NAME;
        var docker1 = "docker tag " + DOCKER_IMAGE + " " + aws_link;
        var docker2 = "eval $(aws ecr get-login --no-include-email | sed 's|https://||')";
        shell.exec(docker1);
        shell.exec(docker2);
        docker.getImage(DOCKER_IMAGE).push({
            registry: aws_link
        }, function(err, data) {
            data.pipe(process.stdout);
            console.log(err);
        });
    }
    return registerTaskDefinition();
}

// Export Statements
exports.GetAccessKeyState = GetAccessKeyState;
exports.GetSecretKeyState = GetSecretKeyState;
exports.GetDeployImageState = GetDeployImageState;
exports.GetUserIdState = GetUserIdState;