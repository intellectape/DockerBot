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

public class TestUseCase2 extends WebTest{

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
		expectReply("Please tell us your startup file name [Note just provide filename like 'app.py']", 3, 5);
		sendMessage("test.py");
		expectReply("Great!!...We found this file", 3, 3);
		expectReply("Note - We didn't find requirements.txt in your project, Dependencies may not get resolved", 3, 3);
		expectReply("Do you want to add any other pip dependencies?. If yes, Please provide comma separated depencies, Else type - no", 3, 6);
		sendMessage("paramiko,telnetlib");
		expectReply("Additional dependencies successfully added", 5, 4);
		expectReply("Successfully created docker file.", 5, 4);
		expectReply("Please wait... While we try to build the image", 5, 4);
		expectReply("Successfully created the docker image", 5, 4);
		expectReply("Please provide AWS Access ID:", 5, 4);
		close();
	}
	@Test
	public void Alternatepath() throws Exception
	{
		login();
		reset();
		//sendMessage("Hey");
		//expectReply("Hello, To Start Using this bot - Please provide me with valid github url", 1, 2);
		sendMessage("https://github.com/CSC-510/Mocking");
		expectReply("Please wait.. while I process your repo.", 3, 4); 
		expectReply("We have successfully processed your repository", 3, 4); 
		expectReply("Please tell us your startup file name [Note just provide filename like 'app.py']", 3, 4);
		sendMessage("test.py");
		expectReply("Great!!...We found this file", 3, 4);
		expectReply("Note - We didn't find requirements.txt in your project, Dependencies may not get resolved", 3, 4);
		expectReply("Do you want to add any other pip dependencies?. If yes, Please provide comma separated depencies, Else type - no", 3, 4);
		sendMessage("no");
		expectReply("No additional dependencies added", 5, 4);
		expectReply("Successfully created docker file.", 5, 4);
		expectReply("Please wait... While we try to build the image", 5, 4);
		expectReply("Successfully created the docker image", 5, 4);
		expectReply("Please provide AWS Access ID:",5, 4);
		close();
	}
}
