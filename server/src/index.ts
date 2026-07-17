import express from "express";
import cors from "cors";
import { boardsRouter } from "./routes/boards.js";
import { columnsRouter } from "./routes/columns.js";
import { cardsRouter } from "./routes/cards.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/boards", boardsRouter);
app.use("/columns", columnsRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
