import { ReactNode } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-h-[40rem] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
      >
        <div className="flex items-center justify-between border-b pb-3">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <IoClose className="size-10" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
