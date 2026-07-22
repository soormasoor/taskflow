import { Router } from "express";
import { prisma } from "../prisma.js";
import { serializeCard } from "../serialize.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const cardsRouter = Router();

cardsRouter.use(requireAuth);

async function assertOwnsCard(cardId: string, userId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { column: { include: { board: true } } },
  });
  return card && card.column.board.userId === userId ? card : null;
}

async function assertOwnsColumnForCard(columnId: string, userId: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: { board: true },
  });
  return column && column.board.userId === userId;
}

cardsRouter.post("/", async (req: AuthedRequest, res) => {
  const { columnId, title, description, labels, dueDate } = req.body;

  if (!columnId || !title) {
    res.status(400).json({ error: "columnId and title are required" });
    return;
  }

  const ownsColumn = await assertOwnsColumnForCard(columnId, req.userId!);
  if (!ownsColumn) {
    res.status(404).json({ error: "Column not found" });
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

cardsRouter.patch("/:id", async (req: AuthedRequest, res) => {
  const cardId = req.params.id as string;
  const { title, description, labels, dueDate } = req.body;

  const owned = await assertOwnsCard(cardId, req.userId!);
  if (!owned) {
    res.status(404).json({ error: "Card not found" });
    return;
  }

  const card = await prisma.card.update({
    where: { id: cardId },
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

cardsRouter.patch("/:id/move", async (req: AuthedRequest, res) => {
  const cardId = req.params.id as string;
  const { columnId, order } = req.body;

  if (!columnId || typeof order !== "number") {
    res.status(400).json({ error: "columnId and order are required" });
    return;
  }

  const owned = await assertOwnsCard(cardId, req.userId!);
  if (!owned) {
    res.status(404).json({ error: "Card not found" });
    return;
  }

  const ownsDestColumn = await assertOwnsColumnForCard(columnId, req.userId!);
  if (!ownsDestColumn) {
    res.status(404).json({ error: "Column not found" });
    return;
  }

  const card = await prisma.card.update({
    where: { id: cardId },
    data: { columnId, order },
  });

  res.json(serializeCard(card));
});

cardsRouter.delete("/:id", async (req: AuthedRequest, res) => {
  const cardId = req.params.id as string;

  const owned = await assertOwnsCard(cardId, req.userId!);
  if (!owned) {
    res.status(404).json({ error: "Card not found" });
    return;
  }

  await prisma.card.delete({ where: { id: cardId } });

  res.status(204).send();
});
