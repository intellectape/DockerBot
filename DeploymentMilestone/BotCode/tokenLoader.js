/*
This file contains all the tokens needs to loaded in the slackbot javascript file in order 
to connect the bot to both AWS and Slack Application.
*/

// Library
var fs = require("fs");

// Loading required data from files.
var configFD = fs.openSync("../configuration/config.json", 'r');
var configData = fs.readFileSync("../configuration/config.json", 'utf8');
var awsConfigFD = fs.openSync("../configuration/aws-config.json", 'r');
var awsConfigData = fs.readFileSync("../configuration/aws-config.json", 'utf-8');

var parsedConfig = JSON.parse(configData);
var parsedAWSConfig = JSON.parse(awsConfigData);

var TOKEN = '';
TOKEN = parsedConfig.slackToken;

var AWS_TOKEN = '';
AWS_TOKEN = parsedAWSConfig;

fs.closeSync(configFD);
fs.closeSync(awsConfigFD);

var getToken = function getToken() {
    return TOKEN;
}

var getAWSToken = function getAWSToken() {
    return AWS_TOKEN;
}

module.exports.getToken = getToken
module.exports.getAWSToken = getAWSToken;
