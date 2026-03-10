import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Researchdocument,
  STATUS_TYPE,
  type Completedresearchprod,
} from "../../shared/types/types";
import { parseDate } from "../../util/parseDate";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../hooks/useUpdateMonitoringForm";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import { useRef, useState } from "react";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import { useMonitoringFormContext } from "../../shared/hooks/useMonitoringFormContext";
import pdfThumbnail from "../../../assets/images/pngwing.com.png";
import RejectedModalMessage from "../../admin/monitoring-form/monitoring-forms/RejectedModalMessage";
import * as React from "react";
import { imageMimeType } from "../../util/ImageMimeTypes";

type CompletedResearchFormProps = {
  completed: Completedresearchprod;
  documents: Researchdocument[];
  formStatus: { [key: number]: string };
};

const CompletedResearchForm = ({
  completed,
  documents,
  formStatus,
}: CompletedResearchFormProps) => {
  const status = useRef<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openRejectedModal, setOpenRejectedModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { refetchData } = useMonitoringFormContext();
  const {
    error,
    isLoading: loading,
    mutate: updateMonitoringForm,
  } = useUpdateMonitoringForm();

  const handleClick = async () => {
    setOpenModal(false);
    setOpenRejectedModal(false);

    const variables: UpdateMonitoringFormVariables = {
      id: completed.researchmonitoringform_id,
      status: status.current,
      isAdmin: false,
      rejected_message: message,
    };
    await updateMonitoringForm(variables);
    refetchData();
    navigate("/coordinator-dashboard");
  };

  if (error)
    return (
      <div className="item-center text-1xl flex h-screen justify-center font-semibold">
        Oops Error: {error.message}
      </div>
    );

  return (
    <>
      <div className="flex w-auto flex-col justify-center">
        <label htmlFor="datePresented" className="text-sm">
          Research Date Completed
        </label>
        <input
          id="datePresented"
          value={parseDate(completed.date_completed)}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="fundSource" className="mt-5 text-sm">
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
            <label htmlFor="datePublication" className="mt-5 text-sm">
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
        <label htmlFor="researchTitle" className="mt-5 text-sm">
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

        <h2 className="text-1xl mb-5 mt-5 font-semibold">
          Supporting Document(s)
        </h2>

        <div className="flex flex-wrap items-center justify-start gap-10">
          {documents.map((item) => (
            <React.Fragment key={item.id}>
              {imageMimeType(item.file_path) ? (
                <a href={item.file_path} target="_blank">
                  <img
                    src={item.file_path}
                    alt="document"
                    loading="lazy"
                    className="rounded-md"
                    width={150}
                    height={150}
                  />
                </a>
              ) : (
                <a
                  href={item.file_path}
                  className="text-sm tracking-wide text-blue-500 hover:underline"
                  target="_blank"
                >
                  <img
                    src={pdfThumbnail}
                    width={150}
                    height={150}
                    loading="lazy"
                    alt="document"
                    className="rounded-md border"
                  />
                </a>
              )}
            </React.Fragment>
          ))}
        </div>

        {formStatus === STATUS_TYPE.PENDING && (
          <div className="w-full text-end">
            <Button
              className="me-3 mt-5 place-self-end rounded-md bg-blue-500 px-5 py-2 font-semibold text-white enabled:hover:bg-blue-800 disabled:cursor-progress disabled:opacity-50"
              onClick={() => {
                status.current = [STATUS_TYPE.APPROVED];
                setOpenModal(true);
              }}
              isDisabled={loading}
              type="button"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="mx-auto animate-spin text-white transition-all duration-300" />
              ) : (
                "Approve"
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
      <ConfirmationModal
        isOpen={openModal}
        type="submit"
        message={`Are you sure you want ${status.current[0] === STATUS_TYPE.APPROVED ? "approve" : "reject"} this research monitoring form?`}
        onCancel={() => setOpenModal(false)}
        onConfirm={handleClick}
      />
      <RejectedModalMessage
        isOpen={openRejectedModal}
        message={message}
        setMessage={setMessage}
        onCancel={() => setOpenRejectedModal(false)}
        onConfirm={handleClick}
      />
    </>
  );
};

export default CompletedResearchForm;
