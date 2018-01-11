# DEPLOYMENT MILESTONE

## Team Members:
|Member Name|Unity ID|
|:---------:|:------:|
|Aditya Bhardwaj|abhardw2|
|Atul Kumar|akumar22|
|Bharath Banglaore Veeranna|bbangla|
|Karan Chaudhary|krchaudh|
|Rakshit Holkal Ravishankar|rhravish|

## Deployment Scripts
Docker bot is deployed in Amazon-EC2 instance. The ansible script used for the deployment is [Deployment.yml](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/DeploymentMilestone/deployment.yaml).

We are using Ansible script to deploy our bot. First it checks we if there is already an EC2 instance running for Bot. If not it will create a new EC2 instance other wise it will reuse the old one. This makes our script idempotent. After that, using ansible, it will check if all necessary dependencies are installed on the EC2 instance and will install dependencies if required. Then using synchronize module of ansible it will copy Bot code from local to EC2 instance and then checks if our application is already running using forever or it will run it if required. Thus we are achieving complete idempotency.

## Task tracking
We have used Trello cards to divide the work into sub-tasks and monitor the progress of tasks. This is the link to [Worksheet.md](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/DeploymentMilestone/Worksheet.md)

## Screencasts
The video showing the deployment of Bot to EC2 using Ansible scripts and the running of the Bot can be found [here](https://www.youtube.com/watch?v=OJcGnjglY4A)

## Acceptance Tests
All the communication between the user and the dockerbot has to be done through slack. For the purpose of our demo, we have created a slack team [The Last Jedi](https://thelastjediteam.slack.com). We have tested all the functionalities of the bot using this slack team. For the TAs, we have created a test account, which can be used to test the working of the bot. The login credentials for the TA account is mentioned below:

	User ID: csc510.dockerbot@gmail.com	Password: dockerbottest		Slack User name: csc510TA

We will be using AWS to deploy the Docker image. Crendentials of the AWS which we are using is given below.   

   	Access Key : AKIAIUD2AR63LM7RTXMA
   	Secret Key : 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
   	User ID : 820211611863
	
To test the functionality of the bot, login to the slack team using [this](https://thelastjediteam.slack.com) link and the credentials povided above. Follow the instructions provided below for all the three usecases:

### Use Case 1 : Creating a Docker file and Docker image

Instructions:  
1. Enter 'reset' to ensure that all the previous states of the bot have been cleared.   

2. Docker Bot now waits for the GitHub URL. Please provide a valid GitHub URL.   
   For example, we have used https://github.com/karanchaudhri/flask-examples for testing.    
   
   **Note:** Our bot doesn't support enterprise GitHub repositories. Bot supports only public GitHub URL links.  
   When a private GitHub URL is provided, bot should throw an error message as below: 
   
		Please wait.. while I process your repo.  
		Unable to process this repository (Or Not Supported)...Please provide valid repo url.  
    
3. Docker now waits for a valid startup file name in the GitHub repository provided.  
   For example, we have used "01-hello-world/hello.py" which contains a simple program to print "Hello World" in Python.  
   
   **Note:** The filename provided should have code in it. Else the creation of Docker file fails and the bot throws an error messgae as shown below:  
   
   		file not found, Please provide absolute path
   
    
The screenshot showing the messages for Use Case 1 when correct inputs are given is as shown below ![ ](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/DeploymentMilestone/images/Use%20Case%201.PNG)

Once these messages are received, bot prompts the user to add any additional dependencies before creating the docker file and docker image. We have demonstrated the end of Use Case 1 by specifying 'no' for adding any dependencies. We can see that the docker file and docker image has been created. This marks the end of Use Case 1.


  ### Usecase 2: Adding additional dependencies to teh docker image

1. The docker bot will ask if any other additional dependencies are to added to the docker image. To add any pip packages to the image, specify the packages in a single line seperated by a comma. For example, to add paramiko and pexpect python packages, give the input as *"paramiko,pexpect"*. 

2. If you do not want any additional packages to be added, type *"no"* in this case. 

3. If you specified any dependencies, the bot will give the output message as *"Additional dependencies successfully added"* indicating that the additional dependencies are added.

4. If you said *"no"* for adding additional dependencies, the bot will reply *"No additional dependencies added"*, indicating that no other requirement was added.

5. After adding the dependencies, the docker will create a dockerfile and build a docker image using this dockerfile. The bot should reply with the following messages:

         Successfully created docker file.  
         Please wait... While we try to build the image  
	     Successfully created the docker image

Once these messages are received, the docker images will be created locally. The messages received above indicate the completion of Usecase 2.  

Below is a screenshot showing the output of Usecase 2:  
![](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/DeploymentMilestone/images/usecase2.jpg)

### Use Case 3 : Deploying the Docker image on AWS  

1. Bot prompts the user to provide the Access Key. Enter **AKIAIUD2AR63LM7RTXMA**  
2. Bot prompts the user to provide the Secret key. Enter **cmAg4kidim6l3/gscyg4RV+UItfragly5r5zFaHO**  
3. Bot prompts the user to provide the User ID. Enter **820211611863**  
4. If any one of these details are incorrect, the bot prompts the user to input valid credentials again.
		
		Please provide correct credentials again. Please enter the Access Key:
   
   The user has to then start providing all three details again.
5. If these three feilds are entered correctly, the bot shows a message like the one shown below:

		Your User Details are:USER ID: 820211611863
		Access Key: AKIAIUD2AR63LM7RTXMA
		Secret Key: cmAg4kidim6l3/gscyg4RV+UItfragly5r5zFaHO
		Please Provide a Repo name where you want to deploy your image:


6. User has to then provide a Repo name. This name has to be in lowercase and should not include any special characters.
7. After this, the bot returns the details of the container where the docker image is deployed. Below are the example messages for the Repo name "deploy".

		Deploying your Docker Image to AWS...
		Repository with name: deploy was created!
		URL for User Access: 820211611863.dkr.ecr.us-east-1.amazonaws.com/deploy
		Pushing docker image to ECR. Please wait...
		Docker image pushed to ECR
		Docker Image running in AWS. Link to access Container: ec2-54-86-47-130.compute-1.amazonaws.com
	
These messages indicates that the Docker has been deployed successfully on AWS. This marks the end of Use Case 3.  
The screenshot showing the messages for Use Case 3 completion is given below.

![ ](https://github.ncsu.edu/abhardw2/CSC-510-Project/blob/master/DeploymentMilestone/images/Use%20Case%203.PNG)
	
	
	
	
	
	
	
	
