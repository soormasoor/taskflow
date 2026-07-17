import { Router } from "express";
import { prisma } from "../prisma.js";

export const columnsRouter = Router();

columnsRouter.post("/", async (req, res) => {
  const { boardId, title } = req.body;

  if (!boardId || !title) {
    res.status(400).json({ error: "boardId and title are required" });
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

columnsRouter.patch("/:id", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const column = await prisma.column.update({
    where: { id: req.params.id },
    data: { title },
  });

  res.json(column);
});

columnsRouter.delete("/:id", async (req, res) => {
  await prisma.column.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});
