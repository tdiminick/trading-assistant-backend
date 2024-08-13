import puppeteer from "puppeteer";
import logger from "../services/logger.js";

const getStockPrice = async (req, res) => {
  logger.info("get stock price: ", req.body, req.decoded);
  const symbol = req.params.symbol;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://finance.yahoo.com/quote/${symbol}`);

  try {
    // evaluate and find the proper element
    const result = await page.evaluate(() => {
      return document.querySelector("fin-streamer.price")?.textContent;
    });

    // make sure it's a number
    if (result === undefined || result === null || isNaN(result)) {
      throw Error("Did not receive a number back from API call");
    }

    await browser.close();
    return res.status(200).send({ price: result });
  } catch (error) {
    logger.error("error scraping price: ", error);
    await browser.close();
    return res.status(400);
  }
};

export default {
  getStockPrice,
};
