import puppeteer from "puppeteer";

import { CustomError } from "../errors/CustomError.js";

export class BeeHandler {
    constructor() {
        this.url_base = "https://judge.beecrowd.com/pt/";
    }

    async __puppeteerWeb(url) {
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        await page.goto(url);
        return { page, browser };
    }

    async beeStats(profileId) {
        const url_profile = `${this.url_base}profile/${profileId}`;
        const { page, browser } = await this.__puppeteerWeb(url_profile);
        var data = {};
        try {
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
                    .match(/url\(["']?([^"')]+)["']?\)/)[1];
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
                    urlHardestSolved: `https://resources.beecrowd.com/repository/UOJ_${hardestSolved}.html`,
                    offensiveDays,
                };
            });
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
