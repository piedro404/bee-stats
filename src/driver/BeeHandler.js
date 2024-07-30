import puppeteer from "puppeteer";
import chromium from '@sparticuz/chromium';
import NodeCache from "node-cache";

import { CustomError } from "../errors/CustomError.js";

export class BeeHandler {
    constructor() {
        this.url_base = "https://judge.beecrowd.com/pt/";
        this.url_uoj = "https://resources.beecrowd.com/repository/UOJ_"
        this.cache = new NodeCache({ stdTTL: 900 });
    }

    async __puppeteerWeb(url) {
        try {
            const browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            });
            const page = await browser.newPage();
            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            );

            await page.goto(url, { timeout: 5000 });
            return { page, browser };
        } catch (error) {
            throw new CustomError(
                "Beecrowd Offline",
                "Unable to render Beecrowd"
            );
        }
    }

    async beeStats(profileId) {
        const cachedData = this.cache.get(profileId);
        if (cachedData) {
            return cachedData;
        }

        const url_profile = `${this.url_base}profile/${profileId}`;
        const { page, browser } = await this.__puppeteerWeb(url_profile);
        var data = {};
        try {
            await page.waitForSelector('.profile-header');
            await page.waitForSelector('.profile-code-infos');

            data = await page.evaluate(() => {
                const profileDiv = document.querySelector(".profile-header");
                const statsDiv = document.querySelector(".profile-code-infos");

                const points = profileDiv.querySelector(
                    ".profile-rank-points-text"
                ).innerHTML;
                const rank =
                    profileDiv.querySelector(".profile-rank-text").innerHTML;
                const avatar = profileDiv
                    .querySelector(".perfil-photo")
                    .getAttribute("style")
                    .match(/url\(["']?([^"')]+)["']?\)/)[1].split('?')[0];
                const joinDate = profileDiv.querySelector(
                    ".profile-infos-join-date"
                ).innerHTML;

                const submissions = statsDiv.querySelector(
                    ".profile-submissions-number"
                ).innerHTML;
                const solved = statsDiv.querySelector(
                    ".profile-solved-number"
                ).innerHTML;
                const hardestSolved = statsDiv.querySelector(
                    ".profile-hardest-number"
                ).innerHTML;
                const offensiveDays =
                    statsDiv.querySelector(".profile-solved-streak-text")
                        ?.innerHTML ?? "0";

                return {
                    points,
                    rank,
                    avatar,
                    joinDate,
                    submissions,
                    solved,
                    hardestSolved,
                    offensiveDays,
                };
            });

            data.urlProfile = url_profile;
            data.urlHardestSolved = `${this.url_uoj}${data.hardestSolved}.html`;
            this.cache.set(profileId, data);
        } catch (error) {
            throw new CustomError(
                "User Not Found",
                "User not found on the page"
            );
        }

        await browser.close();
        return data;
    }
}
