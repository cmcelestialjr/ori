import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

type ConfirmationModalType = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: "submit" | "warning";
  confirmLabel?: string;
  cancelLabel?: string;
};

const ConfirmationModal = ({
  isOpen,
  title = "Confirm Message",
  message,
  onConfirm,
  onCancel,
  type,
  confirmLabel,
  cancelLabel,
}: ConfirmationModalType) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const activeElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmText =
    confirmLabel ?? (type === "submit" ? "Confirm" : "Leave Page");
  const cancelText = cancelLabel ?? "Cancel";

  return createPortal(
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm backdrop-brightness-50 backdrop-saturate-50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-md rounded bg-white p-6 text-gray-900 shadow-lg transition-all duration-200 ease-out"
        onClick={(event) => event.stopPropagation()}
        tabIndex={-1}
        ref={modalRef}
      >
        <h2 className="text-md mb-4 text-center font-semibold text-gray-900">
          {title}
        </h2>
        <p className="mb-4 text-center text-sm text-gray-600">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button
            className={`rounded ${type === "warning" ? "bg-gray-200 text-gray-900 hover:bg-gray-300" : "bg-red-500 text-white hover:bg-red-600"} px-3 py-2 text-sm font-semibold`}
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className={`rounded ${type === "submit" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-red-500 text-white hover:bg-red-600"} px-3 py-2 text-sm font-semibold`}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
