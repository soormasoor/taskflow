import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const columnsRouter = Router();

columnsRouter.use(requireAuth);

async function assertOwnsColumn(columnId: string, userId: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: { board: true },
  });
  return column && column.board.userId === userId ? column : null;
}

columnsRouter.post("/", async (req: AuthedRequest, res) => {
  const { boardId, title } = req.body;

  if (!boardId || !title) {
    res.status(400).json({ error: "boardId and title are required" });
    return;
  }

  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board || board.userId !== req.userId) {
    res.status(404).json({ error: "Board not found" });
    return;
  }

  const lastColumn = await prisma.column.findFirst({
    where: { boardId },
    orderBy: { order: "desc" },
  });
  const order = lastColumn ? lastColumn.order + 1 : 0;

  const column = await prisma.column.create({
    data: { boardId, title, order },
  });

  res.status(201).json(column);
});

columnsRouter.patch("/:id", async (req: AuthedRequest, res) => {
  const columnId = req.params.id as string;
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const owned = await assertOwnsColumn(columnId, req.userId!);
  if (!owned) {
    res.status(404).json({ error: "Column not found" });
    return;
  }

  const column = await prisma.column.update({
    where: { id: columnId },
    data: { title },
  });

  res.json(column);
});

columnsRouter.delete("/:id", async (req: AuthedRequest, res) => {
  const columnId = req.params.id as string;

  const owned = await assertOwnsColumn(columnId, req.userId!);
  if (!owned) {
    res.status(404).json({ error: "Column not found" });
    return;
  }

  await prisma.column.delete({ where: { id: columnId } });

  res.status(204).send();
});
