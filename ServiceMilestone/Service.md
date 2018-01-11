# SERVICE MILESTONE

## Team Members:
|Member Name|Unity ID|
|:---------:|:------:|
|Aditya Bhardwaj|abhardw2|
|Atul Kumar|akumar22|
|Bharath Banglaore Veeranna|bbangla|
|Karan Chaudhary|krchaudh|
|Rakshit Holkal Ravishankar|rhravish|


## General Workflow
![](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/ServiceMilestone/Flow.PNG)

### Use Case #1 : Creating Docker file and Docker Image
a. User provides the github URL which contains the code to be deployed in a container.  
b. The DockerBot clones the repo locally and checks if any requirements file exists in the repo.  
c. If the requirement file is present, it will add the mentioned dependencies and create a docker file.  
d. Using the docker file, the DockerBot creates a docker image and stores it locally.  


### Use Case #2 : Additional dependencies
a. Before creating the Docker file, user would be prompted by the DockerBot for adding any dependencies if needed.  
b. The user can specify dependencies in comma seperated style or else type "NO".  
c. The bot would accomadate these dependencies while creating the Docker file.  


### Use Case #3 : Deploying the Docker image on AWS
a. User provides AWS credentials to the DockerBot.  
b. Docker Bot first validates the AWS credentials and then pushes the Docker image to the ECR.  
c. Docker Bot then creates a task and then starts the Docker container.   

### Task Tracking
We have used Trello cards to divide the work into sub-tasks and monitor the progress of tasks. This is the link to [Worksheet.md](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/ServiceMilestone/Worksheet.md).

## Screencast
Screencast showing the working of the DockerBot can be found [here](https://www.youtube.com/watch?v=QjZtP1IERRE).
