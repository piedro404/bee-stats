import express from "express";
import apiRouter from "./src/routes/api.route.js";
import statsRouter from "./src/routes/stats.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static("src/public"));
app.use("/api/stats", apiRouter);
app.use("/stats", statsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
