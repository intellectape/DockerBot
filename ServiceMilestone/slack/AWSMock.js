/*
This javascript file contains the mocking code for AWS deployment logic written.
Addresses USE CASE 3
 */
var AWS_MOCK = require("mock-aws");
var nock = require("nock");
var data = require("../assets/aws_data.json");


function mock_listContainerInstances(dataNum) {
    AWS_MOCK.mock('ECS', 'listContainerInstances', data.containerInstanceList[dataNum]);
}

function mock_listClusters(dataNum) {
    AWS_MOCK.mock('ECS', 'listClusters', data.clusterInstanceList[dataNum]);
}

// Mocking repository list information for checking the user input repo exists or not
function mock_describeRepositories(dataNum) {
    var myvar = false;
    for (var i = 0; i < data.repositories.length; i++) {
        var obj = data.repositories[i];
        console.log(obj);
        if (obj["repositoryName"] == dataNum) {
            myvar = true;
            break;
        }
    }
    console.log(myvar);
    if (myvar) {
        AWS_MOCK.mock('ECR', 'describeRepositories', true);
    } else {
        AWS_MOCK.mock('ECR', 'describeRepositories', false);
    }

}

// Mocking create repository if user input repo name doesn't exists
function mock_createRepository(dataNum) {
    AWS_MOCK.mock('ECR', 'createRepository', data);
}

// Mocking the register task definition which is done during deployment of docker file.
function mock_registerTaskDefinition(dateNum) {
    AWS_MOCK.mock('ECS', 'registerTaskDefinition', data.taskDefinition);
}

// Mocking the run task function in order to run the docker image after pushing it to the repo.
function mock_runTask(dataNum) {
    AWS_MOCK.mock('ECS', 'runTask', data.taskDefinition);
}

// Export Statements.
exports.mock_listContainerInstances = mock_listContainerInstances;
exports.mock_listClusters = mock_listClusters;
exports.mock_createRepository = mock_createRepository;
exports.mock_describeRepositories = mock_describeRepositories;
exports.mock_registerTaskDefinition = mock_registerTaskDefinition;
exports.mock_runTask = mock_runTask;