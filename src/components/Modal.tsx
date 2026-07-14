import type { ReactNode } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};

function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg p-5 w-full max-w-md border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
