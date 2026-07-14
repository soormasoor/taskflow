import Modal from "./Modal";
import CardForm from "./CardForm";
import { useBoardStore } from "../store/boardStore";

type AddCardModalProps = {
  columnId: string;
  onClose: () => void;
};

function AddCardModal({ columnId, onClose }: AddCardModalProps) {
  const addCard = useBoardStore((state) => state.addCard);

  return (
    <Modal onClose={onClose}>
      <h2 className="text-white font-semibold mb-4">Add card</h2>
      <CardForm
        onSubmit={(values) => {
          addCard(columnId, values);
          onClose();
        }}
        renderFooter={() => (
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
        )}
      />
    </Modal>
  );
}

export default AddCardModal;
