import express from "express";
import apiRouter from "./src/routes/api.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static("src/public"));
app.use("/api/stats", apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
