import express from "express";
import fs from "fs/promises";
import path from "path";
import { BeeHandler } from "../driver/BeeHandler.js";

import { CustomError } from "../errors/CustomError.js"; 

const router = express.Router();
const beeHandler = new BeeHandler();

const loadTemplate = async () => {
    const filePath = path.resolve("src/public/templateProfile.svg");
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

router.get("/:profileId", async (req, res) => {
    try {
        const { profileId } = req.params;
        const data = await beeHandler.beeStats(profileId);

        const template = await loadTemplate();
        const svg = generateSvg(template, data);

        res.setHeader("Content-Type", "image/svg+xml");
        res.send(svg);
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(404).json({ errors: { message: error.message, details: error.details } });
        } else {
            res.status(500).json({ errors: { message: "Internal Server Error", details: error.message } });
        }
    }
});

export default router;
