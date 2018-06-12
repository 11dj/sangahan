import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import faker from "faker";
import puppeteer from "puppeteer";

let browser
let page

beforeAll(async () => {
  // launch browser	
  browser = await puppeteer.launch(
	{
	  headless: false // headless mode set to false so browser opens up with visual feedback
	  // slowMo: 250, // how slow actions should be
	}
  )
  // creates a new page in the opened browser	
  page = await browser.newPage()
})

describe('H1 Text', () => {
  test('Title loads correctly', async () => {

	page.emulate({
	  viewport: {
		width: 500,
		height: 2400
	  },
	  userAgent: ''
	});

	await page.goto('http://localhost:3000/');
	await page.waitForSelector('.title-style');

	const title = await page.$eval('.title-style', e => e.innerHTML);
	expect(title).toBe('Sangahaan');

  }, 16000);
});

describe('checked all', () => {
  test('Checked that input, output and remove correctly', async () => {

	page.emulate({
	  viewport: {
		width: 500,
		height: 2400
	  },
	  userAgent: ''
	});

	await page.goto('http://localhost:3000/');
	await page.waitForSelector('.title-style');

	const title = await page.$eval('.title-style', e => e.innerHTML);
	expect(title).toBe('Sangahaan');

  }, 16000);
});

afterAll(() => {
  browser.close()
})
