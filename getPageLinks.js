const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  //Paste the page you want to scrap in the "" below
  await page.goto("http://books.toscrape.com/");

  //Find all elements and all the selectors to find all the products
  const links = await page.$$eval(".product_pod .image_container a", (allAs) =>
    allAs.map((a) => a.href)
  );

  console.log(("Print out all links:", links));

  const aoaLinks = links.map((l) => [l]);

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(aoaLinks);
  xlsx.utils.book_append_sheet(wb, ws);
  xlsx.writeFile(wb, "PageLinks.xlsx");

  await browser.close();
})();
