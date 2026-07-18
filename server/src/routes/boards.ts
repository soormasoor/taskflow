import { Router } from "express";
import { prisma } from "../prisma.js";
import { serializeCard } from "../serialize.js";

export const boardsRouter = Router();

boardsRouter.get("/", async (req, res) => {
  const boards = await prisma.board.findMany({
    orderBy: { createdAt: "asc" },
  });
  res.json(boards);
});

boardsRouter.get("/:id", async (req, res) => {
  const board = await prisma.board.findUnique({
    where: { id: req.params.id },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          cards: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!board) {
    res.status(404).json({ error: "Board not found" });
    return;
  }

  const serialized = {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.map(serializeCard),
    })),
  };

  res.json(serialized);
});

boardsRouter.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const board = await prisma.board.create({
    data: { title },
  });

  res.status(201).json(board);
});
