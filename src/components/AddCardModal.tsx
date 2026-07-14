import { useState } from "react";
import Modal from "./Modal";
import { useBoardStore } from "../store/boardStore";

type AddCardModalProps = {
  columnId: string;
  onClose: () => void;
};

function AddCardModal({ columnId, onClose }: AddCardModalProps) {
  const addCard = useBoardStore((state) => state.addCard);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labelsInput, setLabelsInput] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const labels = labelsInput
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);

    addCard(columnId, {
      title: title.trim(),
      description: description.trim(),
      labels,
      dueDate: dueDate || null,
    });

    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-white font-semibold mb-4">Add card</h2>
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
        <div className="flex justify-end gap-2 mt-2">
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
            add card
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddCardModal;
