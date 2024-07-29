import express from "express";
import path from "path";
import cors from "cors";

import apiRouter from "./src/routes/api.route.js";
import statsRouter from "./src/routes/stats.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.sendFile(path.resolve("src/public/index.html"));
});

app.use("/api/stats", apiRouter);
app.use("/stats", statsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
