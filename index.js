import { BeeHandler } from "./BeeHandler.js";

const beeHandler = new BeeHandler();
beeHandler
    .beeStats("738578")
    .then((data) => console.log(data))
    .catch((error) => console.error("Erro:", error));
