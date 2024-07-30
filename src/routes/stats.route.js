import express from "express";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import base64Img from "base64-img";
import { BeeHandler } from "../driver/BeeHandler.js";

import { CustomError } from "../errors/CustomError.js"; 

const router = express.Router();
const beeHandler = new BeeHandler();

const loadTemplateV1 = async () => {
    const filePath = path.resolve("src/public/templateProfile.svg");
    return fs.readFile(filePath, "utf-8");
};

const loadTemplateV2 = async () => {
    const filePath = path.resolve("src/public/templateProfileOld.svg");
    return fs.readFile(filePath, "utf-8");
};

const loadTemplateError = async () => {
    const filePath = path.resolve("src/public/templateError.svg");
    return fs.readFile(filePath, "utf-8");
};

const generateSvg = (template, data) => {
    let svg = template;
    for (const key in data) {
        const value = data[key];
        svg = svg.replace(new RegExp(`{${key}}`, "g"), value);
    }
    return svg;
};

const imageToBase64 = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
};

router.get("/:profileId", async (req, res) => {
    try {
        const { profileId } = req.params;
        const data = await beeHandler.beeStats(profileId);

        if (data.avatar) {
            data.avatar = await imageToBase64(data.avatar);
        }

        const template = await loadTemplateV1();
        const svg = generateSvg(template, data);

        res.setHeader("Content-Type", "image/svg+xml");
        res.send(svg);
    } catch (error) {
        const template = await loadTemplateError();
        const svg = generateSvg(template, {});

        res.send(svg);
    }
});

router.get("/:profileId/old", async (req, res) => {
    try {
        const { profileId } = req.params;
        const data = await beeHandler.beeStats(profileId);

        if (data.avatar) {
            data.avatar = await imageToBase64(data.avatar);
        }

        const template = await loadTemplateV2();
        const svg = generateSvg(template, data);

        res.setHeader("Content-Type", "image/svg+xml");
        res.send(svg);
    } catch (error) {
        const template = await loadTemplateError();
        const svg = generateSvg(template, {});

        res.send(svg);
    }
});

export default router;
