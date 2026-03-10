import Button from "../../../shared/components/Button";

type RejectedModalMessageType = {
  isOpen: boolean;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onConfirm: () => void;
  onCancel: () => void;
};

const RejectedModalMessage = ({
  isOpen,
  message,
  setMessage,
  onConfirm,
  onCancel,
}: RejectedModalMessageType) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded bg-white p-6 shadow-lg">
        <h2 className="text-md mb-4 text-center font-semibold">
          Rejected Message
        </h2>
        <textarea
          placeholder="rejected message..."
          value={message}
          autoFocus
          onChange={(e) => setMessage(e.target.value)}
          className="mb-4 w-52 p-2 text-sm"
        />
        <div className="flex justify-end space-x-4">
          <Button
            className="rounded bg-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-300"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RejectedModalMessage;
