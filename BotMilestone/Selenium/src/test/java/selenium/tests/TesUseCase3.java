package selenium.tests;
import selenium.tests.WebTest;

import static org.junit.Assert.*;
import java.util.List;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;
public class TesUseCase3 extends WebTest{
	@Test
	public void Goodpath() throws Exception
	{
		login();
		reset();
		//sendMessage("Hey");
		//expectReply("Hello, To Start Using this bot - Please provide me with valid github url", 1, 2);
		sendMessage("https://github.com/CSC-510/Mocking");
		expectReply("Please wait.. while I process your repo.", 3, 3); 
		expectReply("We have successfully processed your repository", 3, 3);  
		expectReply("Please tell us your startup file name [Note just provide filename like 'app.py']", 3, 3);
		sendMessage("test.py");
		expectReply("Great!!...We found this file", 3, 3);
		expectReply("Note - We didn't find requirements.txt in your project, Dependencies may not get resolved", 3, 3);
		expectReply("Do you want to add any other pip dependencies?. If yes, Please provide comma separated depencies, Else type - no", 3, 3);
		sendMessage("paramiko,telnetlib");
		expectReply("Additional dependencies successfully added", 5, 5);
		expectReply("Successfully created docker file.", 5, 5);
		expectReply("Please wait... While we try to build the image", 5, 5);
		expectReply("Successfully created the docker image", 5, 5);
		expectReply("Please provide AWS Access ID:", 5, 5);
		sendMessage("abcdabcdabcdabcdabcd");
		expectReply("Please enter the Secret Key:", 1, 10);
		sendMessage("abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd");
		expectReply("Please enter the User ID:", 1, 10);
		sendMessage("123456789012");
		expectReply("Your User Details are:USER ID: 123456789012", 6, 8);
		expectReply("Access Key: abcdabcdabcdabcdabcd", 6, 8);
		expectReply("Secret Key: abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd", 6, 8);
		expectReply("Awesome! We are all set and we shall key going!", 6, 8);
		expectReply("Please Provide a Repo name where you want to deploy your image:", 6, 8);
		sendMessage("test");
		expectReply("Repository already exists, using it for deployment!", 3, 5);
		expectReply("Deploying your Docker Image to AWS...", 3, 5);
		expectReply("Docker Image successfully deployed!", 3, 5);
		close();
	}
	@Test
	public void Badpath() throws Exception
	{
		login();
		reset();
		//sendMessage("Hey");
		//expectReply("Hello, To Start Using this bot - Please provide me with valid github url", 1, 2);
		sendMessage("https://github.com/CSC-510/Mocking");
		expectReply("Please wait.. while I process your repo.", 3, 3); 
		expectReply("We have successfully processed your repository", 3, 3);  
		expectReply("Please tell us your startup file name [Note just provide filename like 'app.py']", 3, 3);
		sendMessage("test.py");
		expectReply("Great!!...We found this file", 3, 3);
		expectReply("Note - We didn't find requirements.txt in your project, Dependencies may not get resolved", 3, 3);
		expectReply("Do you want to add any other pip dependencies?. If yes, Please provide comma separated depencies, Else type - no", 3, 3);
		sendMessage("paramiko,telnetlib");
		expectReply("Additional dependencies successfully added", 5, 5);
		expectReply("Successfully created docker file.", 5, 5);
		expectReply("Please wait... While we try to build the image", 5, 5);
		expectReply("Successfully created the docker image", 5, 5);
		expectReply("Please provide AWS Access ID:", 5, 5);
		sendMessage("abcd");
		expectReply("Please enter a valid AccessKey", 1, 3);
		close();
	}
}

