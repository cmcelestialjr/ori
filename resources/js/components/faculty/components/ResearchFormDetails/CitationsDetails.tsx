import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import { CitationsType, STATUS_TYPE } from "../../../shared/types/types";
import { parseDate } from "../../../util/parseDate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { useMutationResearchMonitoringForm } from "../../../admin/monitoring-form/hooks/hook";

type CitationsDetailsType = {
  citations: CitationsType;
  status: string;
};

function CitationsDetails({ citations, status }: CitationsDetailsType) {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const { Delete } = useMutationResearchMonitoringForm();

  const deleteForm = Delete(citations.researchmonitoringform_id);

  const handleClick = async () => {
    setOpenModal(false);
    await deleteForm.mutate();

    navigate(-1);
  };
  return (
    <>
      <div className="mb-5">
        <p>Research Details</p>
        <hr className="h-1 w-1/2 bg-gray-800" />
      </div>
      <div className="space-y-5">
        <div>
          <h2 className="font-semibold">Article Title</h2>
          <p className="pl-5 capitalize underline">
            {citations.research_title}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Journal Title</h2>
          <p className="pl-5 capitalize underline">{citations.journal_title}</p>
        </div>

        <div>
          <h2 className="font-semibold">Published Date:</h2>
          <p className="pl-5 capitalize underline">
            {parseDate(citations.date)}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Authors</h2>
          <p className="pl-5 capitalize underline">{citations.authors}</p>
        </div>
        <div>
          <p>Citation Details</p>
          <hr className="h-1 w-1/2 bg-gray-800" />
        </div>
        <div>
          <h2 className="font-semibold">Authors who cited your research</h2>
          <p className="pl-5 capitalize underline">{citations.cited_authors}</p>
        </div>
        <div>
          <h2 className="font-semibold">
            Research Title that have cited your work
          </h2>
          <p className="pl-5 capitalize underline">
            {citations.cited_article_title}
          </p>
        </div>

        {(status !== STATUS_TYPE.PENDING || status !== STATUS_TYPE.REJECT) && (
          <div className="mt-10 inline-flex w-full justify-end">
            <Button
              className="w-20 rounded-md bg-red-500 px-1 py-3 text-white"
              type="button"
              onClick={() => setOpenModal(true)}
            >
              Delete
            </Button>
          </div>
        )}
        <ConfirmationModal
          isOpen={openModal}
          type="submit"
          message="Are you sure you want to delete research monitoring form?"
          onCancel={() => setOpenModal(false)}
          onConfirm={handleClick}
        />
      </div>
    </>
  );
}

export default CitationsDetails;
