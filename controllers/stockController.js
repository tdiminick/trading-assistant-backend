import puppeteer from 'puppeteer';
import logger from '../services/logger.js';

const getStockPrice = async (req, res) => {
	logger.info('get stock price: ', req.body, req.decoded);
	const symbol = req.params.symbol;

	let browser;
	try {
		browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		await page.goto(`https://finance.yahoo.com/quote/${symbol}`);

		// evaluate and find the proper element
		const result = await page.evaluate(() => {
			return document.querySelector('fin-streamer.price')?.textContent || document.querySelector('fin-streamer.livePrice')?.textContent;
		});

		// make sure it's a number
		if (result === undefined || result === null || isNaN(result)) {
			throw Error('Did not receive a number back from API call');
		}

		await browser.close();
		return res.status(200).send({ price: result });
	} catch (error) {
		logger.error('error scraping price: ', error);
		return res.status(400);
	} finally {
		await browser.close();
	}
};

export default {
	getStockPrice,
};
