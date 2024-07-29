import puppeteer from "puppeteer";
import chromium from '@sparticuz/chromium';
import NodeCache from "node-cache";
import { CustomError } from "../errors/CustomError.js";

export class BeeHandler {
    constructor() {
        this.url_base = "https://judge.beecrowd.com/pt/";
        this.url_uoj = "https://resources.beecrowd.com/repository/UOJ_";
        this.cache = new NodeCache({ stdTTL: 1000 });
        this.browser = null;
    }

    async __initializeBrowser() {
        if (this.browser) return;

        try {
            this.browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            });
        } catch (error) {
            throw new CustomError("Puppeteer Initialization Error", "Unable to initialize Puppeteer");
        }
    }

    async __closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async __puppeteerWeb(url) {
        await this.__initializeBrowser();
        const page = await this.browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        await page.goto(url, { waitUntil: 'networkidle2' });
        return page;
    }

    async beeStats(profileId) {
        const cachedData = this.cache.get(profileId);
        if (cachedData) {
            return cachedData;
        }

        const url_profile = `${this.url_base}profile/${profileId}`;
        const page = await this.__puppeteerWeb(url_profile);
        let data = {};
        try {
            await page.waitForFunction(() =>
                document.querySelector('.profile-header') &&
                document.querySelector('.profile-code-infos')
            );

            data = await page.evaluate(() => {
                const profileDiv = document.querySelector(".profile-header");
                const statsDiv = document.querySelector(".profile-code-infos");

                if (!profileDiv || !statsDiv) {
                    throw new Error("Profile or stats div not found");
                }

                const points = profileDiv.querySelector(".profile-rank-points-text")?.innerHTML || "N/A";
                const rank = profileDiv.querySelector(".profile-rank-text")?.innerHTML || "N/A";
                const avatar = profileDiv.querySelector(".perfil-photo")?.getAttribute("style")
                    ?.match(/url\(["']?([^"')]+)["']?\)/)[1].split('?')[0] || "";
                const joinDate = profileDiv.querySelector(".profile-infos-join-date")?.innerHTML || "N/A";

                const submissions = statsDiv.querySelector(".profile-submissions-number")?.innerHTML || "0";
                const solved = statsDiv.querySelector(".profile-solved-number")?.innerHTML || "0";
                const hardestSolved = statsDiv.querySelector(".profile-hardest-number")?.innerHTML || "0";
                const offensiveDays = statsDiv.querySelector(".profile-solved-streak-text")?.innerHTML || "0";

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
            throw new CustomError("User Not Found", "User not found on the page");
        }

        await page.close();
        return data;
    }
}
