import React, { useState } from "react";
import {
  IntellectualPropertyType,
  Researchdocument,
  STATUS_TYPE,
} from "../../../shared/types/types";
import { parseDate } from "../../../util/parseDate";
import Button from "../../../shared/components/Button";
import { pngwing as pdfThumbnail } from "../../../../assets/images";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import Badge from "../../../shared/components/Badge";
import Tooltip from "../../../shared/components/Tooltip";
import { imageMimeType } from "../../../util/ImageMimeTypes";
import { useMutationResearchMonitoringForm } from "../../../admin/monitoring-form/hooks/hook";

type IntellectualPropertyDetailsType = {
  intellectualproperty: IntellectualPropertyType;
  documents: Researchdocument[];
  status: string;
};
const IntellectualPropertyDetails = ({
  intellectualproperty,
  documents,
  status,
}: IntellectualPropertyDetailsType) => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const { Delete } = useMutationResearchMonitoringForm();

  const deleteForm = Delete(intellectualproperty.researchmonitoringform_id);

  const handleClick = async () => {
    setOpenModal(false);
    await deleteForm.mutate();

    navigate(-1);
  };
  return (
    <>
      <div className="flex w-auto flex-col justify-center">
        <label
          htmlFor="datePresented"
          className="text-sm font-semibold capitalize"
        >
          {intellectualproperty.property_type} Details
        </label>
        <input
          id="datePresented"
          value={intellectualproperty.title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="fundSource" className="mt-5 text-sm font-semibold">
          Owner Name:
        </label>
        <input
          id="fundSource"
          value={intellectualproperty.owner_name}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="datePublication" className="mt-5 text-sm font-semibold">
          Registration Date
        </label>
        <input
          id="datePublication"
          value={parseDate(intellectualproperty.registration_date)}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="datePublication" className="mt-5 text-sm font-semibold">
          Name of the Processor
        </label>
        <input
          id="datePublication"
          value={intellectualproperty.processor_name}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        {intellectualproperty.publication_date && (
          <>
            <label
              htmlFor="datePublication"
              className="mt-5 text-sm font-semibold"
            >
              Publication Date
            </label>
            <input
              id="datePublication"
              value={intellectualproperty.publication_date}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}
        {intellectualproperty.grant_date && (
          <>
            <label
              htmlFor="datePublication"
              className="mt-5 text-sm font-semibold"
            >
              Date Granted
            </label>
            <input
              id="datePublication"
              value={intellectualproperty.publication_date}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}
        {intellectualproperty.acceptance_date && (
          <>
            <label
              htmlFor="datePublication"
              className="mt-5 text-sm font-semibold"
            >
              Date Accepted
            </label>
            <input
              id="datePublication"
              value={intellectualproperty.acceptance_date}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}

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
                    className="text-sm tracking-wide text-blue-500 hover:underline"
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

        {(status === STATUS_TYPE.PENDING || status === STATUS_TYPE.REJECT) && (
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
};

export default IntellectualPropertyDetails;
