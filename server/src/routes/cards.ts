import { Router } from "express";
import { prisma } from "../prisma.js";
import { serializeCard } from "../serialize.js";

export const cardsRouter = Router();

cardsRouter.post("/", async (req, res) => {
  const { columnId, title, description, labels, dueDate } = req.body;

  if (!columnId || !title) {
    res.status(400).json({ error: "columnId and title are required" });
    return;
  }

  const lastCard = await prisma.card.findFirst({
    where: { columnId },
    orderBy: { order: "desc" },
  });
  const order = lastCard ? lastCard.order + 1 : 0;

  const card = await prisma.card.create({
    data: {
      columnId,
      title,
      description: description ?? "",
      labels: Array.isArray(labels) ? labels.join(",") : "",
      dueDate: dueDate ? new Date(dueDate) : null,
      order,
    },
  });

  res.status(201).json(serializeCard(card));
});

cardsRouter.patch("/:id", async (req, res) => {
  const { title, description, labels, dueDate } = req.body;

  const card = await prisma.card.update({
    where: { id: req.params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(labels !== undefined && {
        labels: Array.isArray(labels) ? labels.join(",") : "",
      }),
      ...(dueDate !== undefined && {
        dueDate: dueDate ? new Date(dueDate) : null,
      }),
    },
  });

  res.json(serializeCard(card));
});

cardsRouter.patch("/:id/move", async (req, res) => {
  const { columnId, order } = req.body;

  if (!columnId || typeof order !== "number") {
    res.status(400).json({ error: "columnId and order are required" });
    return;
  }

  const card = await prisma.card.update({
    where: { id: req.params.id },
    data: { columnId, order },
  });

  res.json(serializeCard(card));
});

cardsRouter.delete("/:id", async (req, res) => {
  await prisma.card.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});
