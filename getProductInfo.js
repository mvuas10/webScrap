const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

//Function with attributes you want to scrap for below
async function getPageData(url, page) {
  await page.goto(url);

  const title = await page.$eval(
    ".product_main h1",
    (title) => title.textContent
  );
  const price = await page.$eval(".price_color", (price) => price.textContent);
  const availability = await page.$eval(
    ".instock.availability",
    (avail) => avail.innerText
  );

  return {
    title: title,
    price: price,
    availability: availability,
  };
}

//Function to get links on pages
async function getLinks() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("http://books.toscrape.com/");

  const links = await page.$$eval(".product_pod .image_container a", (allAs) =>
    allAs.map((a) => a.href)
  );
  await browser.close();
  return links;
}

//Function to launch the browser and open a new page
async function main() {
  const allLinks = await getLinks();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const scrapedData = [];

  for (let link of allLinks) {
    const data = await getPageData(link, page);
    // const secondToWait = (Math.floor(Math.random() * 4) + 1) * 1000;
    // await page.waitFor(secondToWait);
    scrapedData.push(data);
  }

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(scrapedData);
  xlsx.utils.book_append_sheet(wb, ws);
  xlsx.writeFile(wb, "BookInfo.xlsx");

  await browser.close();
  console.log("Done!");
}

main();
