# BOT MILESTONE

## Team Members:
|Member Name|Unity ID|
|:---------:|:------:|
|Aditya Bhardwaj|abhardw2|
|Atul Kumar|akumar22|
|Bharath Banglaore Veeranna|bbangla|
|Karan Chaudhary|krchaudh|
|Rakshit Holkal Ravishankar|rhravish|


## Use Cases (15%)
We have created 3 use cases for "Docker Bot" and they are listed below:
### Use Case 1: User provides link to his/her Github repository to the bot. Bot creates a Docker file based on the dependencies. 
#### 1. Precondition
	* User/Application developer should have the code in a Github Link.

#### 2. Main Flow
	* User/Application developer will request the bot to create docker file. [S2]
	* User/Application developer will provide the Github link and the requirements text. This will be parsed by the Bot to understand the requirements. [S3]

#### 3. Subflows
	[S1] User provides the Github link to the bot.
	[S2] Bot looks for 'requirements.txt' file in the Github link.
	[S5] Bot creates a docker file based on the contents of 'requirements.txt' file.

#### 4. Alternative Flows
	[E1] The Github link provided by the user is invalid.
	[E2] There is no requirements text file in the Github link.

Use case 1: 
![alt text](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/BotMilestone/images/Use_case_1.png)


### Use Case 2: User can interact with the bot to specify any additional dependencies of his application.     
#### 1.Precondition  
      * This additional requirement should be specified before the creation of Docker file.  

#### 2.Main Flow  
      * After providing the Github link, user can specify additional dependencies of his application. These dependencies will be added to the Docker file.  
      
#### 3. Subflows  
	[S1] Bot asks the user if there are any additional dependencies for the application.  
	[S2] User provides additional dependencies to the bot.  
	[S3] Bot merges the new dependencies to the old requriements and creates the docker file.  

#### 4.  Alternative Flows  
	[E1] User doesn't have any additional dependencies.    

Use case 2: 
![alt text](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/BotMilestone/images/Use_Case_2.png)

### Use Case 3: Bot deploys the docker image on AWS and returns the IP address of the AWS instance back to the user.
#### 1. Precondition
        User should have valid AWS credentials.

#### 2.  Main Flow
	 * User/Application developer will request the bot to create docker file. [S2]
	 * User/Application developer will provide the Github link with the requirements text file, which will be parsed by the Bot to understand the requirements. [S3]
	 * Bot will request AWS credentials from the user. User provides valid AWS credentials to the bot.

#### 3. Subflows
	[S1] Bot deploys the docker image on AWS. 
	[S2] Bot would notify the users with the details of the IP address of AWS container.

#### 4. Alternative flows
	[E1] AWS credentials provided by the user  is invalid.
	[E2] Docker image could not be deployed on AWS.

Use case 3: 
![alt text](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/BotMilestone/images/Use_Case_3.png)

### Mocking (20%)
**Goal:** 

For DockerBot we will be using following functionalities:
1. Docker 
2. Git 
3. AWS functionalities.

In BOT Milestone, we are mocking the behavior of the bot for above functionalities when provided with the user input. 

* **For mocking Git behavior**, we have created JSON Objects to mock File System and Git behaviour:
	* Git Clone: for mocking the Git Link given by the user.
	* File System Mock: for showing mocked up file system to the user.
* **For mocking AWS behavior**, we have create aws_data.json for the inputs provided in order:
	* Setting User Credentials
	* Find AWS repository where to deploy Image
	* Create AWS repository if not present in current pool.
	* Deploy Docker Image
		* Register Task Definition to run
		* Create a cluster if not available else use default cluster
		* Run Task (to run the Docker Image)

[JSON file for the AWS Mock Data in this link](./assets/aws_data.json)

### Bot Implementation (30%)

**Bot Platform and Integration:** 

DockerBot is the bot application which is developed in order to provide the docker file build and deployment process to user on the fly. This bot performs the following tasks:

* It takes GitHub repository link from the user.
* It process the GitHub repository and asks for startup file.
* It checks for requirement.txt for the project, if not found asks for any requirements user might have.
* It asks for user's AWS credentials and repository name to deploy the project. 
* It deploys the project and gives the access link to the user.

This bot is helpful to user who doesn't have access to a Laptop or Desktop and want to deploy a project on the fly.

[Please find all the files for this Milestone in this link](./slack/)

### Selenium Testing  

We have used Selenium to test each test cases. Each test case has been tested for a good path and an alternate/bad path. 
Some of the common functions used in all Test Cases are present [here](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/BotMilestone/Selenium/src/test/java/selenium/tests/WebTest.java).
#### Use Case 1  
***Goodpath*** : Providing correct GitHub links where user application is present.  
***Alternate/Bad path*** :  Providing wrong GitHub links.  
[Code for Testing Use Case 1](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/BotMilestone/Selenium/src/test/java/selenium/tests/TestUseCase1.java)    


#### Use Case 2  
***Goodpath***: User provides additional pip dependencies to the bot.  
***Alternate path*** : User doesn't provide any additional dependency.  
[Code for Testing Use Case 2](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/BotMilestone/Selenium/src/test/java/selenium/tests/TestUseCase2.java)     


#### Use Case 3  
This Use case is about deploying the docker image to AWS. At this stage, we have mocked the AWS service to accept AWS access ID, Secret Key and User ID. AWS access ID should be a string of 20 characters, Secret Key should be a string of 40 characters and User ID should be a string having 12 digits. Any other input from the user which doesn't satisfy these requriements is treated as wrong input and User will be asked to provide credentials once again.   
***Goopath*** : User provides all valid inputs and is able to deploy the Docker image onto AWS.  
***Badpath*** : User provides a wrong input and bot asks for valid credentials.  
[Code for Testing Use Case 3](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/BotMilestone/Selenium/src/test/java/selenium/tests/TesUseCase3.java) 

### Screencast  
Screencast showing the three use cases can be found [here](https://youtu.be/CptvxX7Om6s)


