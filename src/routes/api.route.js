import express from "express";
import { BeeHandler } from "../driver/BeeHandler.js";

import { CustomError } from "../errors/CustomError.js"; 

const router = express.Router();
const beeHandler = new BeeHandler();

router.get("/:profileId", async (req, res) => {
    try {
        const { profileId } = req.params;
        const data = await beeHandler.beeStats(profileId);
        res.json({ data });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(404).json({ errors: { message: error.message, details: error.details } });
        } else {
            res.status(500).json({ errors: { message: "Internal Server Error", details: error.message } });
        }
    }
});

export default router;
