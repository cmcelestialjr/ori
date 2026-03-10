import React, { useState } from "react";
import {
  Presentedresearchprod,
  Researchdocument,
  STATUS_TYPE,
} from "../../../shared/types/types";
import { imageMimeType } from "../../../util/ImageMimeTypes";
import { pngwing as pdfThumbnail } from "../../../../assets/images";
import Tooltip from "../../../shared/components/Tooltip";
import Button from "../../../shared/components/Button";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { parseDate } from "../../../util/parseDate";
import Badge from "../../../shared/components/Badge";
import { useMutationResearchMonitoringForm } from "../../../admin/monitoring-form/hooks/hook";

type PresentedResearchFormProps = {
  presented: Presentedresearchprod;
  documents: Researchdocument[];
  status: string;
};

function PresentedResearch({
  presented,
  documents,
  status,
}: PresentedResearchFormProps) {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const { Delete } = useMutationResearchMonitoringForm();
  const deleteForm = Delete(presented.researchmonitoringform_id);

  const handleClick = async () => {
    setOpenModal(false);
    await deleteForm.mutate();

    navigate(-1);
  };
  return (
    <>
      <div className="space-y-5">
        <div>
          <h2 className="font-semibold">Title:</h2>
          <p className="pl-5 capitalize underline">
            {presented.presentation_title}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Activity Name:</h2>
          <p className="pl-5 capitalize underline">
            {presented.conference_name}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Conference Organization:</h2>
          <p className="pl-5 capitalize underline">
            {presented?.conference_organization}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Presented at:</h2>
          <p className="pl-5 capitalize underline">
            {presented?.conference_place} -{" "}
            {parseDate(presented.date_presented)}
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold">Document(s):</h2>
          {documents.map((item) => (
            <React.Fragment key={item.id}>
              {imageMimeType(item.file_path) ? (
                <div className="my-4 flex items-center justify-start gap-5">
                  <a
                    href={item.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tooltip text="Click to open document.">
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
                  <h3>
                    Status: <Badge type={item.status} />
                  </h3>
                </div>
              ) : (
                <div className="my-4 flex items-center justify-start gap-5">
                  <a
                    href={item.file_path}
                    className="text-sm capitalize tracking-wide text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tooltip text="Click to open document.">
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

                  <h3>
                    Status: <Badge type={item.status} />
                  </h3>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Research Attachment */}
        <div className="space-y-5">
          {(status !== STATUS_TYPE.PENDING ||
            status !== STATUS_TYPE.REJECT) && (
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
      </div>
    </>
  );
}

export default PresentedResearch;
