import { Router } from "express";
import { prisma } from "../prisma.js";
import { serializeCard } from "../serialize.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const boardsRouter = Router();

boardsRouter.use(requireAuth);

boardsRouter.get("/", async (req: AuthedRequest, res) => {
  const boards = await prisma.board.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" },
  });
  res.json(boards);
});

boardsRouter.get("/:id", async (req: AuthedRequest, res) => {
  const boardId = req.params.id as string;

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          cards: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!board || board.userId !== req.userId) {
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

boardsRouter.post("/", async (req: AuthedRequest, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const board = await prisma.board.create({
    data: { title, userId: req.userId! },
  });

  res.status(201).json(board);
});
