const puppeteer = require('puppeteer')
const fs = require('fs')

const productsArray = []

const write = (productsArray) => {
  fs.writeFile('products.json', JSON.stringify(productsArray, null, 2), () => {
    console.log('Archivo escrito en formato limpio')
  })
}

const scrapper = async (url) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({ width: 1080, height: 1024 })

  let hasMoreOffers = true
  let maxScrollAttempts = 20 // Máximo de intentos de scroll para evitar bucle infinito
  let scrollAttempts = 0

  console.log('Navegando a la URL...')
  await page.goto(url, { waitUntil: 'networkidle2' })
  console.log('Página cargada correctamente.')

  while (
    hasMoreOffers &&
    scrollAttempts < maxScrollAttempts &&
    productsArray.length < 100
  ) {
    console.log('Comenzando intento de scroll...')

    let loadMore = true
    while (
      loadMore &&
      scrollAttempts < maxScrollAttempts &&
      productsArray.length < 100
    ) {
      console.log('Desplazándose hacia abajo...')

      await page.evaluate(async () => {
        await new Promise((resolve) => {
          const totalScrollHeight = window.innerHeight
          let currentScroll = 0
          const scrollStep = 50
          const scrollInterval = 25

          const scrollSmoothly = setInterval(() => {
            window.scrollBy(0, scrollStep)
            currentScroll += scrollStep
            if (currentScroll >= totalScrollHeight) {
              clearInterval(scrollSmoothly)
              resolve()
            }
          }, scrollInterval)
        })
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const loadMoreButtonVisible = await page.$(
        'button[data-testid="load-more-view-more-button"]'
      )

      if (loadMoreButtonVisible) {
        console.log('Botón "Ver más ofertas" encontrado.')
      } else {
        console.log('Botón "Ver más ofertas" no encontrado.')
      }

      loadMore = !loadMoreButtonVisible
      scrollAttempts++
    }

    console.log('Extrayendo productos visibles...')

    const arrayDivs = await page.$$(
      '.ProductCard-module__card_uyr_Jh7WpSkPx4iEpn4w'
    )

    if (arrayDivs.length > 0) {
      console.log(`Productos encontrados: ${arrayDivs.length}`)
    } else {
      console.log('No se encontraron productos.')
    }

    for (const productDiv of arrayDivs) {
      if (productsArray.length >= 100) {
        hasMoreOffers = false // Detener el scraping cuando llegamos a 100 productos
        break
      }

      try {
        let title = await productDiv.$eval(
          'span.a-truncate-full.a-offscreen',
          (el) => el.textContent.trim()
        )

        let img = await productDiv.$eval('img', (el) => el.src)

        let discount = await productDiv.$$eval('span.a-size-mini', (spans) =>
          spans.length > 1 ? spans[1].textContent.trim() : null
        )

        const product = {
          title,
          discount,
          img
        }

        console.log('Producto recolectado:', product)
        productsArray.push(product)
      } catch (error) {
        console.error('Error al extraer información del producto:', error)
      }
    }

    try {
      const loadMoreButton = await page.$(
        'button[data-testid="load-more-view-more-button"]'
      )
      if (loadMoreButton) {
        console.log('\nPASAMOS A LA SIGUIENTE PÁGINA')
        console.log(`llevamos ${productsArray.length} datos recolectados`)

        await page.evaluate(() => {
          document
            .querySelector('button[data-testid="load-more-view-more-button"]')
            .click()
        })

        await page.waitForSelector(
          '.ProductCard-module__card_uyr_Jh7WpSkPx4iEpn4w',
          { timeout: 5000 }
        )

        scrollAttempts = 0
      } else {
        hasMoreOffers = false
      }
    } catch (error) {
      console.error('Error al intentar cargar más ofertas:', error)
      hasMoreOffers = false
    }
  }

  write(productsArray)

  await browser.close()
}

scrapper(
  'https://www.amazon.es/deals?ref_=nav_cs_gb&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522'
)

module.exports = { scrapper }
