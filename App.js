const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const dotenv = require("dotenv").config();
const path = require("path");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    return (
        await ctx.replyWithPhoto({
            url: "https://media.istockphoto.com/vectors/green-radar-screen-with-planes-and-world-map-vector-id638520210?k=20&m=638520210&s=612x612&w=0&h=QjX49GxbN_INnSJL5oyKWjO_8-2SJL6C-XNMnmTUfwM=",
        }),
        await ctx.reply("Enter the plain number")
    );
});

async function parse(ctx) {}
bot.on("text", (ctx) => {
    let temp = ctx;
    let planeNumber = ctx.message.text;
    console.log(planeNumber);
    let browser, page;
    browser = puppeteer.launch().then((browser) => {
        page = browser.newPage().then((page) => {
            page.goto(
                `https://flightaware.com/live/flight/${planeNumber}`
            ).then(() => {
                let pageData = page
                    .evaluate(() => {
                        return {
                            html: document.documentElement.innerHTML,
                        };
                    })
                    .then((pageData) => {
                        // script parsing
                        pageData = pageData.html.split("\n").join("");
                        // #2 - Split at start of data
                        pageData = pageData.split("var trackpollBootstrap")[1];
                        // #3 - Remove the first equals sign
                        const spot = pageData.split("=");
                        spot.shift();
                        // #4 - Join the split data and split again at the closing tag
                        data = spot.join("=").split(";</script>")[0];
                        data = JSON.parse(data);
                        let flyight;
                        let res = "";
                        for (el in data.flights) {
                            flyight = data.flights[el].activityLog.flights;
                            for (flights of flyight) {
                                console.log(flights.origin.friendlyName);
                                console.log(flights.destination.friendlyName);
                                res +=`
                                ${flights.origin.friendlyName}` + " - " + flights.destination.friendlyName + "\n";
                                //  fs.appendFileSync(
                                //      "flights.txt",
                                //      `${JSON.stringify(
                                //          flights.origin.friendlyName
                                //      )} ${JSON.stringify(flights.destination.friendlyName)}\n`
                                //  );
                            }
                        }
                        // const $ = cheerio.load(pageData.html);
                        browser.close();
                        let flightsData = fs.readFileSync("./flights.txt");
                        console.log(flightsData);
                        temp.reply(`Last flights of ${planeNumber}: ${res}`);
                    });
            });
        });
    });
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
