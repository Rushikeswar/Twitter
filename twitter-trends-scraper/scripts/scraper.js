const { Builder, By, Key, until } = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');
const chrome = require('selenium-webdriver/chrome');
const axios = require('axios');
const path = require('path');
const chromePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
require('dotenv').config();

async function fetchTrends() {
    // Get the list of proxies from the environment variable
    const proxyUrls = process.env.PROXYMESH_URL ? process.env.PROXYMESH_URL.split(',') : [];
    if (!proxyUrls.length) {
        console.error('No proxies found in the PROXYMESH_URL environment variable.');
        return;
    }

    // Select a random proxy from the list
    const proxyUrl = proxyUrls[Math.floor(Math.random() * proxyUrls.length)];

    // Chrome options for headless mode and optimized performance
    const options = new chrome.Options();
    options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);
    options.addArguments(
        '--headless', 
        '--disable-gpu', 
        '--no-sandbox', 
        '--disable-dev-shm-usage'
    );
    options.setChromeBinaryPath(chromePath);
    // Build the WebDriver with proxy configuration
    const driver = await new Builder()
        .forBrowser('chrome')
        .setProxy(proxy.manual({
            http: proxyUrl,
            https: proxyUrl,
        }))
        .setChromeOptions(options)
        .build();

    try {
        // Step 1: Navigate to Twitter login page
        console.log('Navigating to Twitter login page...');
        await driver.get('https://x.com/i/flow/login');

        // Step 2: Enter Username
        console.log('Entering username...');
        await driver.wait(until.elementLocated(By.name('text')), 10000);
        const usernameInput = await driver.findElement(By.name('text'));
        await usernameInput.sendKeys(process.env.TWITTER_USERNAME, Key.RETURN);

        // Step 3: Handle Password or Username Prompt
        console.log('Handling password or second username prompt...');
        await driver.wait(
            until.elementLocated(By.css('input[name="password"], input[name="text"]')),
            10000
        );

        const passwordField = await driver.findElements(By.name('password'));
        if (passwordField.length > 0) {
            // Enter Password
            const passwordInput = passwordField[0];
            await passwordInput.sendKeys(process.env.TWITTER_PASSWORD, Key.RETURN);
        } else {
            // Enter Username Again
            const secondUsernameInput = await driver.findElement(By.name('text'));
            await secondUsernameInput.sendKeys(process.env.TWITTER_USERNAME, Key.RETURN);

            // Wait for Password Input
            await driver.wait(until.elementLocated(By.name('password')), 10000);
            const passwordInput = await driver.findElement(By.name('password'));
            await passwordInput.sendKeys(process.env.TWITTER_PASSWORD, Key.RETURN);
        }

        // Step 4: Wait for the homepage to load
        console.log('Waiting for homepage to load...');
        await driver.wait(until.urlContains('x.com/home'), 15000);

        // Step 5: Navigate to the trending page
        console.log('Navigating to the trending page...');
        await driver.get('https://x.com/explore/tabs/trending');

        // Step 6: Locate trend elements
        console.log('Locating trends...');
        await driver.wait(until.elementsLocated(By.css('div[data-testid="trend"]')), 10000);

        const trendElements = await driver.findElements(By.css('div[data-testid="cellInnerDiv"]'));
        const topTrends = await Promise.all(
            trendElements.slice(0, 5).map(async (trendElement) => {
                const spanElements = await trendElement.findElements(By.css('span'));
                if (spanElements.length > 3) {
                    return await spanElements[3].getText();
                }
                return null;
            })
        );

        // Filter out any null values (if trends couldn't be extracted properly)
        const filteredTrends = topTrends.filter(Boolean);

        // Debugging empty trends
        if (filteredTrends.length === 0) {
            console.warn('No trends found! There might be an issue with the page structure.');
        }

        // Step 7: Get Public IP Address
        console.log('Fetching public IP address...');
        const ipResponse = await axios.get('https://httpbin.org/ip');
        const ipAddress = ipResponse.data.origin || 'Unknown';

        // Return the result with all required fields
        return {
            trends: filteredTrends,
            proxyUsed: proxyUrl,
            timestamp: new Date(),
            ipAddress: ipAddress,
        };
    } catch (error) {
        console.error('Error fetching trends:', error);
        return {
            error: error.message,
            proxyUsed: proxyUrl,
            timestamp: new Date(),
        };
    } finally {
        console.log('Closing the browser...');
        await driver.quit();
    }
}

module.exports = fetchTrends;
