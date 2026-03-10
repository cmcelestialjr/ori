import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import {
  Publishedresearchprod,
  Researchdocument,
  STATUS_TYPE,
} from "../../../shared/types/types";
import { parseDate } from "../../../util/parseDate";
import React, { useState } from "react";
import { pngwing as pdfThumbnail } from "../../../../assets/images";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button";
import Tooltip from "../../../shared/components/Tooltip";
import Badge from "../../../shared/components/Badge";
import { imageMimeType } from "../../../util/ImageMimeTypes";
import { useMutationResearchMonitoringForm } from "../../../admin/monitoring-form/hooks/hook";

type PublishedResearchDetailsType = {
  published: Publishedresearchprod;
  documents: Researchdocument[];
  status: string;
};

function PublishedResearchDetails({
  published,
  documents,
  status,
}: PublishedResearchDetailsType) {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const { Delete } = useMutationResearchMonitoringForm();

  const deleteForm = Delete(published.researchmonitoringform_id);

  const handleClick = async () => {
    setOpenModal(false);
    await deleteForm.mutate();

    navigate(-1);
  };
  return (
    <>
      <div className="mb-5">
        <p>Published Research Details</p>
        <hr className="h-1 w-1/2 bg-gray-800" />
      </div>
      <div className="space-y-5">
        <div>
          <h2 className="font-semibold">Article Title</h2>
          <p className="pl-5 capitalize underline">
            {published.research.title}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Journal Title</h2>
          <p className="pl-5 capitalize underline">{published.journal_name}</p>
        </div>

        <div>
          <h2 className="font-semibold">Published Date:</h2>
          <p className="pl-5 capitalize underline">
            {parseDate(published.date)}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Authors</h2>
          <p className="pl-5 capitalize underline">
            {published.research.authors}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Publisher</h2>
          <p className="pl-5 capitalize underline">
            {published.editor_publisher}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Publisher</h2>
          <p className="pl-5 capitalize underline">{published.indexing}</p>
        </div>
        <div>
          <h2 className="mb-2 mt-10 font-semibold">Document(s):</h2>
          {documents.map((item) => (
            <React.Fragment key={item.id}>
              {imageMimeType(item.file_path) ? (
                <div className="flex items-center gap-x-10">
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
                  <div className="flex flex-col gap-y-2">
                    <p className="text-sm font-semibold">Status:</p>
                    <Badge type={item.status} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-x-10">
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
                  <div className="flex flex-col gap-y-2">
                    <p className="text-sm font-semibold">Status:</p>
                    <Badge type={item.status} />
                  </div>
                </div>
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

export default PublishedResearchDetails;
