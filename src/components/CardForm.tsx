import { useState } from "react";
import type { ReactNode } from "react";

type CardFormValues = {
  title: string;
  description: string;
  labels: string[];
  dueDate: string | null;
};

type CardFormProps = {
  initialValues?: CardFormValues;
  onSubmit: (values: CardFormValues) => void;
  renderFooter: () => ReactNode;
};

function CardForm({ initialValues, onSubmit, renderFooter }: CardFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [labelsInput, setLabelsInput] = useState(
    initialValues?.labels.join(", ") ?? "",
  );
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const labels = labelsInput
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      labels,
      dueDate: dueDate || null,
    });
  }

  return (
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
      {renderFooter()}
    </form>
  );
}

export default CardForm;
