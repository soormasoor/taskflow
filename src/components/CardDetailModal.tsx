import { useState } from "react";
import Modal from "./Modal";
import { useBoardStore } from "../store/boardStore";
import type { Card } from "../types";

type CardDetailModalProps = {
  card: Card;
  onClose: () => void;
};

function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [labelsInput, setLabelsInput] = useState(card.labels.join(", "));
  const [dueDate, setDueDate] = useState(card.dueDate ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const labels = labelsInput
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);

    updateCard(card.id, {
      title: title.trim(),
      description: description.trim(),
      labels,
      dueDate: dueDate || null,
    });

    onClose();
  }

  function handleDelete() {
    deleteCard(card.id);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-white font-semibold mb-4">Edit card</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          autoFocus
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500 resize-none"
        />
        <input
          type="text"
          placeholder="Labels, comma separated"
          value={labelsInput}
          onChange={(e) => setLabelsInput(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
        />
        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5"
          >
            delete
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
            >
              cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-1.5"
            >
              save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default CardDetailModal;
