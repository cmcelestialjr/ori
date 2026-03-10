import React, { useRef, useState } from "react";
import {
  OtherResearchType,
  Researchdocument,
  STATUS_TYPE,
} from "../../../shared/types/types";
import { useNavigate } from "react-router-dom";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../../../ResearchCoordinator/hooks/useUpdateMonitoringForm";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import Badge from "../../../shared/components/Badge";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Button from "../../../shared/components/Button";
import Tooltip from "../../../shared/components/Tooltip";
import { imageMimeType } from "../../../util/ImageMimeTypes";
import { pngwing as pdfThumbnail } from "../../../../assets/images";
import RejectedModalMessage from "./RejectedModalMessage";

type OtherResearchFormProps = {
  otherresearch: OtherResearchType;
  documents: Researchdocument[];
  formStatus: string;
  points: number;
};

const OtherResearchForm = ({
  otherresearch,
  documents,
  formStatus,
  points,
}: OtherResearchFormProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [openRejectedModal, setOpenRejectedModal] = useState(false);
  const [editPoints, setEditPoints] = useState(points);
  const [rejectedMessage, setRejectedMessage] = useState("");
  const status = useRef<string[]>([]);
  const navigate = useNavigate();

  const {
    mutate: updateForm,
    isLoading: loading,
    isError: error,
  } = useUpdateMonitoringForm();

  const handleClick = async () => {
    setOpenModal(false);
    const updateVariables: UpdateMonitoringFormVariables = {
      id: otherresearch.researchmonitoringform_id,
      status: status.current,
      rejected_message: "",
      isAdmin: true,
      adminParams: { points: editPoints, rejected_message: rejectedMessage },
    };

    await updateForm(updateVariables);
    navigate(-1);
  };

  if (error)
    return (
      <div className="item-center text-1xl flex h-screen justify-center font-semibold">
        Oops Error: {error}
      </div>
    );

  return (
    <>
      <div className="flex w-auto flex-col justify-center">
        <label htmlFor="Activity/Seminar/Research Title" className="text-sm">
          Research Involvement
        </label>
        <input
          id="Activity/Seminar/Research Title"
          value={otherresearch.research_involvement}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        {otherresearch.research_title && (
          <>
            {" "}
            <label
              htmlFor="Activity/Seminar/Research Title"
              className="mt-5 text-sm"
            >
              Title
            </label>
            <input
              id="Activity/Seminar/Research Title"
              value={otherresearch.research_title}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}
        <label htmlFor="date" className="mt-5 text-sm">
          Nature of Fund Source
        </label>
        <input
          id="date"
          value={otherresearch.fund_source_nature}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="organizer" className="mt-5 text-sm">
          Date of Research Involvement
        </label>
        <input
          id="organizer"
          value={otherresearch.date}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="points" className="mt-5 text-sm">
          Points
        </label>
        <input
          id="points"
          onChange={(e) => setEditPoints(+e.target.value)}
          type="number"
          value={editPoints}
          className="w-auto text-ellipsis border-b border-b-green-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

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
        {formStatus === STATUS_TYPE.APPROVED && (
          <div className="w-full text-end">
            <Button
              className="me-3 mt-5 place-self-end rounded-md bg-green-500 px-5 py-2 font-semibold text-white enabled:hover:bg-green-800 disabled:cursor-progress disabled:opacity-50"
              onClick={() => {
                status.current = [STATUS_TYPE.EVALUATED];
                setOpenModal(true);
              }}
              isDisabled={loading}
              type="button"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="mx-auto animate-spin text-white transition-all duration-300" />
              ) : (
                "Evaluate"
              )}
            </Button>
            <Button
              className="mt-5 place-self-end rounded-md bg-red-500 px-5 py-2 font-semibold text-white enabled:hover:bg-red-800 disabled:cursor-progress disabled:opacity-50"
              onClick={() => {
                status.current = [STATUS_TYPE.REJECT];
                setOpenRejectedModal(true);
              }}
              isDisabled={loading}
              type="button"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="mx-auto animate-spin text-white transition-all duration-300" />
              ) : (
                "Reject"
              )}
            </Button>
          </div>
        )}
      </div>
      <RejectedModalMessage
        isOpen={openRejectedModal}
        message={rejectedMessage}
        setMessage={setRejectedMessage}
        onCancel={() => setOpenRejectedModal(false)}
        onConfirm={() => setOpenRejectedModal(false)}
      />
      <ConfirmationModal
        isOpen={openModal}
        message="Are you sure you want to update?"
        onCancel={() => setOpenModal(false)}
        type="submit"
        onConfirm={handleClick}
      />
    </>
  );
};

export default OtherResearchForm;
