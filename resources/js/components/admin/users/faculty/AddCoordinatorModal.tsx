import Button from "../../../shared/components/Button";
import { UserDataTable } from "../../types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type CoordinatorModalType = {
  isOpen: boolean;
  faculty: UserDataTable | undefined;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const AddCoordinatorModal = ({
  isOpen,
  onCancel,
  onConfirm,
  faculty,
  loading,
}: CoordinatorModalType) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded bg-white p-6 shadow-lg">
        <h2 className="text-md mb-4 text-center font-semibold">
          Promote to Research Coordinator
        </h2>
        <p className="my-3 text-center">
          Are you sure you want to assign the{" "}
          <span className="font-bold">Research Coordinator</span> role to{" "}
          <span className="font-bold">{faculty?.name}</span> for the{" "}
          <span className="font-bold">{faculty?.college}</span> department?
        </p>
        <p className="mb-4 text-center text-sm text-gray-500">
          They will be able to log in with their existing credentials and choose
          which dashboard to use.
        </p>
        <div className="mt-2 flex justify-end gap-4">
          <Button
            className="rounded bg-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-300"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            isDisabled={loading}
            onClick={onConfirm}
            className="rounded bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-pointer"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin transition-all duration-300" />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCoordinatorModal;
