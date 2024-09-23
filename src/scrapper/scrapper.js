//! scrapper

const puppeteer = require('puppeteer')

const scrapper = async (url) => {
  const browser = await puppeteer.launch({ headless: false })

  const page = await browser.newPage()

  await page.goto(url)

  await page.setViewport({ width: 1080, height: 1024 })

  const arrayDivs = await page.$$(
    '.ProductCard-module__card_uyr_Jh7WpSkPx4iEpn4w'
  )

  for (const productDiv of arrayDivs) {
    const className = await productDiv.evaluate((el) => el.className)
    console.log(className)
  }
  browser.close()
}

scrapper(
  'https://www.amazon.es/deals?ref_=nav_cs_gb&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522'
)

module.exports = { scrapper }
