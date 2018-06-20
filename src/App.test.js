import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import faker from "faker";
import puppeteer from "puppeteer";

const lead = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  message: faker.random.words()
};

let browser
let page
const url = "http://localhost:3000/";
const width = 1920;
const height = 1080;

beforeAll(async () => {
  // launch browser	
  browser = await puppeteer.launch({
	  headless: false // headless mode set to false so browser opens up with visual feedback
	  // slowMo: 250, // how slow actions should be
	})
  // creates a new page in the opened browser	
  page = await browser.newPage()

  page.emulate({
	  viewport: { width, height },
	  userAgent: ''
	});
})

describe('H1 Text', () => {
  test('Title loads correctly', async () => {

	await page.goto(url);
	await page.waitForSelector('.title-style');
	const title = await page.$eval('.title-style', e => e.innerHTML);
  expect(title).toBe('Sangahaan');
  

  }, 16000);
});

describe('checked input', () => {
  test('Checked that input correctly', async () => {

  await page.goto(url);
  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  // await page.evaluate(() => console.log(`url is ${location.href}`));
  // await page.waitForSelector('#input-food-name');
  await page.click("input[name=foodname]");
  await page.type("input[name=foodname]", lead.message);
  await page.click("input[name=byname]");
  await page.type("input[name=byname]", lead.name);
  await page.click('button#submit');
  await page.waitForSelector('.who-order-div');

  }, 16000);
});

afterAll(() => {
  browser.close()
})
