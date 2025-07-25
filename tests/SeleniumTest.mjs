import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

const environment = process.argv[2] || 'local';

const seleniumUrl = environment === 'github' 
  ? 'http://selenium:4444/wd/hub'
  : 'http://localhost:4444/wd/hub';

const serverUrl = environment === 'github' 
  ? 'http://testserver'
  : 'http://host.docker.internal';

console.log(`Running tests in '${environment}' environment`);
console.log(`Selenium URL: ${seleniumUrl}`);
console.log(`Server URL: ${serverUrl}`);

(async function mainTest() {
  let driver;
  try {
    driver = await new Builder()
      .forBrowser('chrome')
      .usingServer(seleniumUrl)
      .build();

    await testHomePage(driver);
    await testValidInput(driver);
    await testXSSInput(driver);
    await testSQLInjectionInput(driver);
    await testEmptyInput(driver);

    console.log('\n✅ All tests passed successfully!');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  } finally {
    if (driver) await driver.quit();
  }
})();

// =========== TEST CASES ===========

async function testHomePage(driver) {
  console.log('\n▶️ Testing Home Page');
  await driver.get(serverUrl);

  const heading = await driver.findElement(By.tagName('h1'));
  const headingText = await heading.getText();
  assert.strictEqual(headingText.trim(), 'Enter Search Term');

  const searchInput = await driver.findElement(By.name('search'));
  assert.ok(searchInput);

  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  assert.ok(submitButton);

  console.log('✅ Home Page OK');
}

async function testValidInput(driver) {
  console.log('\n▶️ Testing Valid Input');
  await driver.get(serverUrl);

  const searchInput = await driver.findElement(By.name('search'));
  await searchInput.sendKeys('hello world');

  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await submitButton.click();

  await driver.wait(until.elementLocated(By.tagName('h1')), 3000);
  const headingText = await driver.findElement(By.tagName('h1')).getText();
  assert.strictEqual(headingText.trim(), 'Search Result');

  const resultText = await driver.findElement(By.tagName('p')).getText();
  assert.ok(resultText.includes('hello world'));

  console.log('✅ Valid Input Test Passed');
}

async function testXSSInput(driver) {
  console.log('\n▶️ Testing XSS Input');
  await driver.get(serverUrl);

  const searchInput = await driver.findElement(By.name('search'));
  await searchInput.sendKeys('<script>alert(1)</script>');

  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await submitButton.click();

  await driver.wait(until.elementLocated(By.tagName('h1')), 3000);
  const headingText = await driver.findElement(By.tagName('h1')).getText();
  assert.strictEqual(headingText.trim(), 'Enter Search Term');

  console.log('✅ XSS Input Rejected (Redirected to Home)');
}

async function testSQLInjectionInput(driver) {
  console.log('\n▶️ Testing SQL Injection Input');
  await driver.get(serverUrl);

  const searchInput = await driver.findElement(By.name('search'));
  await searchInput.sendKeys("1 OR 1=1; DROP TABLE users");

  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await submitButton.click();

  await driver.wait(until.elementLocated(By.tagName('h1')), 3000);
  const headingText = await driver.findElement(By.tagName('h1')).getText();
  assert.strictEqual(headingText.trim(), 'Enter Search Term');

  console.log('✅ SQL Injection Input Rejected (Redirected to Home)');
}

async function testEmptyInput(driver) {
  console.log('\n▶️ Testing Empty Input');
  await driver.get(serverUrl);

  const searchInput = await driver.findElement(By.name('search'));
  await searchInput.clear(); // Ensure input is empty

  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await submitButton.click();

  await driver.wait(until.elementLocated(By.tagName('h1')), 3000);
  const headingText = await driver.findElement(By.tagName('h1')).getText();
  assert.strictEqual(headingText.trim(), 'Enter Search Term');

  console.log('✅ Empty Input Rejected (Remained on Home)');
}
