// const cheerio = require("cheerio");
// const puppeteer = require('puppeteer')
// const fs = require('fs')


// (async () => {
//     const browser = await puppeteer.launch()

//     const page = await browser.newPage()
//     await page.goto('https://flightaware.com/live/flight/N769QS')
    
//     const pageData = await page.evaluate(() => {
//         return {
//             html: document.documentElement.innerHTML
//         }
//     })

//     const $ = cheerio.load(pageData.html)
//     const route =  $('.flightPageActivityLogDataPart')
//     console.log(route.text())
//     fs.writeFileSync('parserdep.json', `Time:${(route)}`)
//     await browser.close()
// })()

const cheerio = require("cheerio");
const puppeteer = require('puppeteer')
const fs = require("fs");


(async () => {
    const browser = await puppeteer.launch()

    const page = await browser.newPage()
    await page.goto('https://flightaware.com/live/flight/N769QS')
    
    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML
        }
    })

    const $ = cheerio.load(pageData.html)

    const date = $('.flightPageActivityLogDate')
    const route = $('.flightPageActivityLogDataPart')
    fs.appendFileSync('date.json', `Date: ${date}`)
    fs.appendFileSync('route.json', `Route: ${route}`)
    await browser.close()
})()