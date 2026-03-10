import React from "react";
import Button from "../../../../shared/components/Button";

type UpdateParticipationPointsModalType = {
  isOpen: boolean;
  points: number;
  message: string;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  label?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const UpdatePointsModal = ({
  isOpen,
  points,
  message,
  setPoints,
  onConfirm,
  onCancel,
  label,
}: UpdateParticipationPointsModalType) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded bg-white p-6 shadow-lg">
        <h2 className="text-md mb-4 text-center font-semibold">{message}</h2>
        <label className="self-start">
          {label ? label : "Enter new points"}
        </label>
        <input
          value={points}
          className="mt-1 block w-full rounded-md border-2 border-blue-500 px-1 py-2 outline-blue-500"
          onChange={(e) => setPoints(Number(e.target.value))}
          type="number"
          min="0"
          step="0.01"
        />
        <div className="mt-3 flex justify-end space-x-4">
          <Button
            className="rounded bg-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-300"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed"
            onClick={onConfirm}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePointsModal;
