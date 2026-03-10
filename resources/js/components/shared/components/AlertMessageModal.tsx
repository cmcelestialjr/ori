import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type AlertMessageModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  autoCloseMs?: number;
};

const AlertMessageModal = ({
  isOpen,
  message,
  onClose,
  autoCloseMs = 3000,
}: AlertMessageModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    timeoutRef.current = setTimeout(() => {
      onClose();
    }, autoCloseMs);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen, onClose, autoCloseMs]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-lg bg-white p-5 shadow-lg transition-all duration-200 ease-out sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <span className="text-xl leading-none">×</span>
        </button>
        <p className="pr-8 text-center text-sm text-red-600 sm:text-base">
          {message}
        </p>
      </div>
    </div>,
    document.body
  );
};

export default AlertMessageModal;
