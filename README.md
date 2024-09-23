# Proyecto 9

## Descripción

Este proyecto es un **scraper** web desarrollado con [Puppeteer](https://github.com/puppeteer/puppeteer), que recolecta información de productos de una página de Amazon que tiene paginación de datos. El scraper navega por las páginas, recolecta el **nombre**, **descuento** y **imagen** de los productos, y guarda los datos en un archivo JSON.

## Requisitos

- Node.js (v14 o superior)
- NPM (Node Package Manager)

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/ViBaTo/Proyecto9.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd puppeteer-scraper
   ```

3. Instala las dependencias del proyecto usando NPM:

   ```bash
   npm install
   ```

## Uso

Para ejecutar el scraper y recolectar los productos, simplemente ejecuta el siguiente comando:

```bash
npm run scrape
```
