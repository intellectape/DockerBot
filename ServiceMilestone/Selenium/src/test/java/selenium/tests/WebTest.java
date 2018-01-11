package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;

import java.util.concurrent.TimeUnit;
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

public class WebTest
{
	public static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}
	
	public void login() throws Exception
	{	
		driver.get("https://thelastjediteam.slack.com/messages/C7PCBDAFN/");
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[@class=' no_bottom_margin']")));
		
		List<WebElement> mailId = driver.findElements(By.xpath("//p[@class=' no_bottom_margin']/input"));
		mailId.get(0).sendKeys("bbangla@ncsu.edu");
		
		List<WebElement> passwd = driver.findElements(By.xpath("//p[@class=' small_bottom_margin']/input"));
		passwd.get(0).sendKeys("Software2017");
		
		List<WebElement> button = driver.findElements(By.xpath("//div[@class='col span_4_of_6 float_none margin_auto signin_card']/form/p/button[.='Sign in']"));
		button.get(0).click();
		
	}

	public void sendMessage(String message) throws Exception
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='msg_input_wrapper']/div/div")));
		List<WebElement> msg = driver.findElements(By.xpath("//div[@class='msg_input_wrapper']/div/div"));
		
		msg.get(0).sendKeys("@dockerbot " + message);
		msg.get(0).sendKeys(Keys.ENTER);
	}
	
	
	public void expectReply(String replyMessage, int numOfMessages, int sleepTime) throws Exception
	{
		TimeUnit.SECONDS.sleep(sleepTime);
		
		//driver.navigate().refresh();
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='day_msgs']")));
		driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
		
		List<WebElement> msg = driver.findElements(By.xpath("//div[@class='day_msgs']"));
		
		WebElement lastDay = msg.get(msg.size()-1);
		
		List<WebElement> replies = lastDay.findElements(By.xpath("//ts-message/div[@class='message_content']/span[@class='message_body'][not(contains(text(), 'Pssst!'))]"));
		
		System.out.print(replies.size() + "\n");
		
		String finalReply = "";
		/*for(int i=numOfMessages; i > 0; i--)
		{
			TimeUnit.SECONDS.sleep(1);
			String rep = replies.get(replies.size() - i).getAttribute("innerText");
			
			System.out.print(rep + "\n");
			finalReply += rep;
			if(i > 1) {
				finalReply += "\r\n";
			}
			
		}*/
		
		boolean expectTrue = false;
		for(int i=numOfMessages; i > 0; i--)
		{
			TimeUnit.SECONDS.sleep(1);
			String rep = replies.get(replies.size() - i).getAttribute("innerText");
			System.out.print(rep + "\n");
			if(rep.equals(replyMessage))
			{
				//System.out.print(rep + "\n");
				expectTrue = true;
				break;
			}
			
		}
		
		assertEquals(expectTrue, true);
	}
	
	public void close() throws Exception
	{
		driver.close();
		driver = new ChromeDriver();
	}
	
	public void reset() throws Exception
	{
		sendMessage("reset");
		expectReply("Hello, To Start Using this bot - Please provide me with valid github url", 1, 2);
	}
	
}