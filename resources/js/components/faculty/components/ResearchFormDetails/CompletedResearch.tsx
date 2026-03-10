import {
  Completedresearchprod,
  Researchdocument,
  STATUS_TYPE,
} from "../../../shared/types/types";
import { parseDate } from "../../../util/parseDate";
import { pngwing as pdfThumbnail } from "../../../../assets/images";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import Tooltip from "../../../shared/components/Tooltip";
import Button from "../../../shared/components/Button";
import { imageMimeType } from "../../../util/ImageMimeTypes";
import { useMutationResearchMonitoringForm } from "../../../admin/monitoring-form/hooks/hook";

type CompletedResearchFormProps = {
  completed: Completedresearchprod;
  status: string;
  documents: Researchdocument[];
};

function CompletedResearch({
  completed,
  status,
  documents,
}: CompletedResearchFormProps) {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const { Delete } = useMutationResearchMonitoringForm();

  const deleteForm = Delete(completed.researchmonitoringform_id);

  const handleClick = async () => {
    setOpenModal(false);
    await deleteForm.mutate();

    navigate(-1);
  };
  return (
    <>
      <div className="flex w-auto flex-col justify-center">
        <label htmlFor="datePresented" className="text-sm font-semibold">
          Research Date Completed
        </label>
        <input
          id="datePresented"
          value={parseDate(completed.date_completed)}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="fundSource" className="mt-5 text-sm font-semibold">
          Research Fund Source
        </label>
        <input
          id="fundSource"
          value={completed.nature_fund_source}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        {completed.target_date_publication && (
          <>
            <label
              htmlFor="datePublication"
              className="mt-5 text-sm font-semibold"
            >
              Target Date Publication
            </label>
            <input
              id="datePublication"
              value={parseDate(completed.target_date_publication)}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}
        <h2 className="text-1xl mt-10 font-semibold">Attached Research</h2>
        <label htmlFor="researchTitle" className="mt-5 text-sm font-semibold">
          Research Title
        </label>
        <input
          id="researchTitle"
          value={completed.research.title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <p className="mb-1 mt-5 text-sm">Author(s)</p>
        <span className="text-sm tracking-wide">
          {completed.research.authors}
        </span>
        <label
          htmlFor="researchTitle"
          className="mb-1 mt-5 text-sm font-semibold"
        >
          Research
        </label>

        <div className="flex flex-wrap items-center justify-start gap-10">
          {documents.map((item) => (
            <React.Fragment key={item.id}>
              {imageMimeType(item.file_path) ? (
                <a href={item.file_path} target="_blank">
                  <Tooltip text="Click to view document">
                    <img
                      src={item.file_path}
                      alt="document"
                      loading="lazy"
                      className="rounded-md"
                      width={150}
                      height={150}
                    />
                  </Tooltip>
                </a>
              ) : (
                <a
                  href={item.file_path}
                  className="text-sm tracking-wide text-blue-500 hover:underline"
                  target="_blank"
                >
                  <Tooltip text="Click to view document">
                    <img
                      src={pdfThumbnail}
                      width={150}
                      height={150}
                      loading="lazy"
                      alt="document"
                      className="rounded-md border"
                    />
                  </Tooltip>
                </a>
              )}
            </React.Fragment>
          ))}
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
      </div>
      <ConfirmationModal
        isOpen={openModal}
        type="submit"
        message="Are you sure you want to delete research monitoring form?"
        onCancel={() => setOpenModal(false)}
        onConfirm={handleClick}
      />
    </>
  );
}

export default CompletedResearch;
