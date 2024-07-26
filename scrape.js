const puppeteer = require("puppeteer");

async function beeStats(profileId) {
    const url_profile = `https://judge.beecrowd.com/pt/profile/${profileId}`;

    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(url_profile);

    const data = await page?.evaluate(() => {
        try {
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
                data: {
                    points,
                    rank,
                    avatar,
                    joinDate,
                    submissions,
                    solved,
                    hardestSolved,
                    offensiveDays,
                },
            };
        } catch (error) {
            return {
                errors: {
                    details: "User Not Found",
                },
            };
        }
    });

    console.log(data);

    await browser.close();
}

beeStats("1");
