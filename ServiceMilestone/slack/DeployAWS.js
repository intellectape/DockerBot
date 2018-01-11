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
var mocking = false;

// Setting default region from our side
var REGION = 'us-east-1';
AWS.config.update({
    region: REGION
});
var awsConfigFD;
var awsConfigData;
var parsedAWSConfig;

// Default Variables to be accessed throughout the program.
var ACCESS_KEY = '';
var SECRET_KEY = '';
var USER_ID = '';
var JSON_STRING = '';
var REPO_NAME = '';
var DOCKER_IMAGE = 'test';
var CONTAINER_NAME = "default";
var aws_link = '';

var clusterName = "";

//AWS.config.paramValidation = false;

// Function to configure all the AWS credentials for the AWS SDK
function configureAws() {

    if (!AWS.config.region) {
        AWS.config.update({
            region: REGION
        });
    }
    AWS.config.credentials = new AWS.Credentials({
        IdentityPoolId: REGION,
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY
    });
    //console.log(AWS.config);
    return "Configured AWS credentials";
}

// Function to fetch User ID from AWS for a set of Access Key and Secret
// Now stale as taking input from User.
function getUserID() {
    var intermediatMessage = configureAws();
    return intermediatMessage;
    var sts = new AWS.STS();
    var new_user = sts.getCallerIdentity({}, function(err, data) {
        if (err) {
            console.log("Error", err);
            return null;
        } else {
            var accountData = JSON.stringify(data.Account);
            return accountData;
        }
    });
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

var testToggle = true;
// Function to test if the correct user id is input or not
function testUser(successReply, errorReply, intermediateReply) {
    try {
        var iam = new AWS.IAM();
        iam.getUser({}, function(err, data) {
            if (err) {
                console.log(err, err.stack)
                testToggle = false;
                successReply("Please provide correct credentials again. Please enter the Access Key:");
            } else {
                var accountData = data.User.UserId;
                if (accountData == USER_ID) {
                    testToggle = true;
                    successReply("Please Provide a Repo name where you want to deploy your image:");
                } else {
                    console.log(accountData);
                    console.log(USER_ID)
                    testToggle = false;
                    successReply("Please provide correct credentials again. Please enter the Access Key:");
                }
            }
        });
    } catch (exception) {
        testToggle = false;
        successReply("Please provide correct credentials again. Please enter the Access Key:");
    }
}

//var testToggle = true;
// The function to test whether to connection is right or not
function testConnection(successReply, errorReply, intermediateReply) {
    try {
        var params = {};
        var ecs = AWS.ECS();
        ecs.listClusters(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                testToggle = false;
                successReply("Please provide correct credentials again. Please enter the Access Key:");
            } else {
                testToggle = true;
                if (testUser()) {
                    successReply("Please Provide a Repo name where you want to deploy your image:");
                } else {
                    successReply("Please provide correct credentials again. Please enter the Access Key:");
                }
            }
        });
    } catch (exception) {
        testToggle = false;
        successReply("Please provide correct credentials again. Please enter the Access Key:");
    }

}


function checkCluster() {
    var params = {};
    var ecs = new AWS.ECS();
    clusterName = "arn:aws:ecs:us-east-1:" + USER_ID + ":cluster/default";
    ecs.listClusters(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            return false;
        } else {
            if (data.clusterArns.includes(clusterName)) {
                return true;
            }
            //console.log(data.clusterArns);
            return false;
        }
    });
}

// Code for register containter instance.
function registerContainerInstance() {
    var params = {
        attributes: [{
            name: 'mytestContainer',
            /* required */
            targetType: "container-instance"
        }, ],
        cluster: CONTAINER_NAME
    };
    ecs.registerContainerInstance(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            return false;
        } else {
            console.log(data); // successful response
            return true;
        }
    });
}

function createCluster(successReply, errorReply, intermediateReply) {
    var params = {
        clusterName: CONTAINER_NAME
    };
    var ecs = new AWS.ECS();
    ecs.createCluster(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            errorReply("Couldn't create cluster, please try creating online on the portal.");
        } else {
            //console.log(data); // successful response
            if (registerContainerInstance()) {
                errorReply("Couldn't create container instance, please try creating online on the portal.");
            } else {
                successReply("Successfully created the cluster and the container instance.");
            }
        }
    });
}



// Function to check whether a user input Repo exists or not.
function checkImage(repo_name, callback) {

    if (mocking) {
        nock.mock_describeRepositories(repo_name);
    }
    var params = {};
    var ecr = new AWS.ECR();
    //console.log("CheckImage\n")
    ecr.describeRepositories(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred

        } else {
            var found = false;
            for (var i = 0; i < data.repositories.length; i++) {
                console.log(data.repositories[i].repositoryName)
                if (data.repositories[i].repositoryName == repo_name)
                    found = true;
            }
            callback(found);
        }
    });
}

// Function to create a Repository if user have already not created the repo before
function createImage(repo_name, callback) {
    if (mocking) {
        nock.mock_createRepository(repo_name);
    }

    var params = {
        "repositoryName": repo_name /* required */
    };

    //console.log("create image thing");

    var ecr = new AWS.ECR();
    ecr.createRepository(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback("Repository with name: " + repo_name + " cannot be created!");
        } else {
            callback("Repository with name: " + params.repositoryName + " was created!\n" + "URL for User Access: " + data.repository.repositoryUri);
            //console.log(data); // successful response
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
            configureAws();
            var message = "USER ID: " + USER_ID;
            var message_access = "Access Key: " + ACCESS_KEY;
            var message_secret = "Secret Key: " + SECRET_KEY;
            intermediateReply("Your User Details are:" + message, function() {
                intermediateReply(message_access, function() {
                    intermediateReply(message_secret, function() {
                        testUser(successReply, errorReply, intermediateReply)
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
    if (testToggle) {
        return new GetDeployImageState();
    } else {
        return new GetAccessKeyState();
    }

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
                intermediateReply(reply, function() {
                    intermediateReply("Repository already exists, using it for deployment!");
                });
            }
            // Deploying data to the docker container.
            intermediateReply("Deploying your Docker Image to AWS...", function() {
                deployDocker(successReply, errorReply, intermediateReply);

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

function createService() {
    var params = {
        desiredCount: 2,
        loadBalancers: [{
            containerName: "simple-docker",
            containerPort: 80,
            loadBalancerName: "EC2Contai-EcsElast-15DCDAURT3ZO2"
        }],
        role: "ecsServiceRole",
        serviceName: "ecs-simple-service-elb",
        taskDefinition: "console-sample-app-static"
    };
    ecs.createService(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        //else console.log(data); // successful response
    });
}

// Function to register task definition while trying to deploy a docker image on the repository
function registerTaskDefinition(successReply, errorReply, intermediateReply) {
    if (mocking) {
        nock.mock_registerTaskDefinition(0);
    }
    /*if (checkCluster()) {
        console.log("It exists");
    } else {
        createCluster(CONTAINER_NAME, function(reply) {
            //console.log(reply);
        });
    }*/

    console.log(aws_link);
    var params = {
        family: "my-taskr1",
        containerDefinitions: [{
            name: CONTAINER_NAME,
            image: aws_link,
            portMappings: [{
                containerPort: 5000,
                hostPort: 80
            }],
            essential: true,
            memory: 500
        }]
    };

    var ecs = new AWS.ECS();
    ecs.registerTaskDefinition(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            errorReply("Error");
        } else {
            //console.log(data); // successful response
            console.log("Task register success");
            runTask(successReply, errorReply, intermediateReply);
        }
    });
}

// Function to run the docker image in the repository after pushing complete file on the repo.
function runTask(successReply, errorReply, intermediateReply) {
    if (mocking) {
        nock.mock_runTask(0);
    }
    var params = {
        cluster: CONTAINER_NAME,
        taskDefinition: "my-taskr1",
        count: 1
    };
    var ecs = new AWS.ECS();
    ecs.runTask(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            errorReply("Error");
        } else {
            //console.log(data); // successful response
            //var runningUrl = data.tasks[0].containers[0].networkBindings[0].bindIP;
            //runningUrl = runningUrl.toString();
            //console.log("Task run success\n");
            //successReply("Docker Image up and running! \nThis is the url you can use to access the running file: " + runningUrl);
            getContainerDetails(data.tasks[0].containerInstanceArn, successReply, errorReply, intermediateReply);
        }
    });
}

function getContainerDetails(containerARN, successReply, errorReply, intermediateReply) {
    var params = {
        "containerInstances": [containerARN]
    }

    var ecc = new AWS.ECS();
    ecc.describeContainerInstances(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            getURL(data.containerInstances[0].ec2InstanceId, containerARN, successReply, errorReply, intermediateReply)
        }
    })
}

function getURL(ec2InstanceId, containerARN, successReply, errorReply, intermediateReply) {
    var params = {
        InstanceIds: [ec2InstanceId]
    }

    var ec2 = new AWS.EC2();
    ec2.describeInstances(params, function(err, data) {
        if (err) {
            //console.log("Error in instance")
            console.log(err, err.stack)
        } else {
            //console.log(data)
            successReply("Docker Image running in AWS. Link to access Container: " + data.Reservations[0].Instances[0].PublicDnsName)
        }
    })
}

function getAuthToken(successReply, errorReply, intermediateReply) {
    var ecr = AWS.ECR();

    var params = {}

    ecr.getAuthorizationToken(params, function(err, data) {
        if (err) {
            console.log("GetAuthToken error\n")
            console.log(err, err.stack)
        } else {
            //console.log("Token");
            //console.log(data)
            var temp = "https://" + USER_ID + ".dkr.ecr." + REGION + ".amazonaws.com"
            var content = "\"{\n\\\"auths\\\": {\n \\\"" + temp + "\\\": {\n\\\"auth\\\": \\\"" + data.authorizationData[0].authorizationToken + "\\\"}\n }\n } \""
                //console.log(content)
            exec("mv ~/.docker/config.json ~/.docker/config_old.json", function(error, stdout, stderr) {
                if (error) {
                    console.log("move error\n")
                    console.log(error)
                }

                exec("echo " + content + " > ~/.docker/config.json", function(er, stdo, stder) {

                    if (er) {
                        console.log("echo error\n")
                        console.log(er)
                    }

                    intermediateReply("Pushing docker image to ECR. Please wait...")
                    var docker2 = "docker push " + aws_link + ":latest"
                    exec(docker2, function(e, o, se) {
                        if (e) {
                            console.log("Push error\n")
                            console.log(e);
                            errorReply("Docker image push to ECR failed")
                        } else {
                            intermediateReply("Docker image pushed to ECR")
                            registerTaskDefinition(successReply, errorReply, intermediateReply);
                            exec("mv ~/.docker/config_old.json ~/.docker/config.json");
                        }
                    });
                })

            })

        }
    });
}

// Function to deploy docker image on the AWS repository from user input.
function deployDocker(successReply, errorReply, intermediateReply) {
    if (!mocking) {
        var docker = new Docker();
        aws_link = USER_ID + ".dkr.ecr." + REGION + ".amazonaws.com/" + REPO_NAME;
        var docker1 = "docker tag " + DOCKER_IMAGE + ":latest " + aws_link;
        //var docker2 = "eval $(aws ecr get-login --no-include-email | sed 's|https://||')";
        var docker2 = "docker push " + aws_link;
        shell.exec(docker1);
        //shell.exec(docker2);
        getAuthToken(successReply, errorReply, intermediateReply);
    }
    //return registerTaskDefinition();
}

// Export Statements
exports.GetAccessKeyState = GetAccessKeyState;
exports.GetSecretKeyState = GetSecretKeyState;
exports.GetDeployImageState = GetDeployImageState;
exports.GetUserIdState = GetUserIdState;