import Modal from "./Modal";
import CardForm from "./CardForm";
import { useBoardStore } from "../store/boardStore";
import type { Card } from "../types";

type CardDetailModalProps = {
  card: Card;
  onClose: () => void;
};

function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);

  function handleDelete() {
    deleteCard(card.id);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-white font-semibold mb-4">Edit card</h2>
      <CardForm
        initialValues={{
          title: card.title,
          description: card.description,
          labels: card.labels,
          dueDate: card.dueDate,
        }}
        onSubmit={(values) => {
          updateCard(card.id, values);
          onClose();
        }}
        renderFooter={() => (
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
        )}
      />
    </Modal>
  );
}

export default CardDetailModal;
