import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CitationsType, STATUS_TYPE } from "../../shared/types/types";
import { parseDate } from "../../util/parseDate";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../hooks/useUpdateMonitoringForm";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import { useRef, useState } from "react";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import { useMonitoringFormContext } from "../../shared/hooks/useMonitoringFormContext";
import RejectedModalMessage from "../../admin/monitoring-form/monitoring-forms/RejectedModalMessage";

type CitationsFormProps = {
  citations: CitationsType;
  formStatus: string;
};

const CitationsForm = ({ citations, formStatus }: CitationsFormProps) => {
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
    const variables: UpdateMonitoringFormVariables = {
      id: citations.researchmonitoringform_id,
      status: status.current,
      isAdmin: false,
      rejected_message: message,
    };
    await updateMonitoringForm(variables);
    refetchData();
    setOpenModal(false);
    setOpenRejectedModal(false);
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
        <label htmlFor="title" className="text-sm">
          Research Title
        </label>
        <input
          id="title"
          value={citations.research_title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="authors" className="mt-5 text-sm">
          Authors
        </label>
        <input
          id="authors"
          value={citations.authors}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="datePublished" className="mt-5 text-sm">
          Date Publication
        </label>
        <input
          id="datePublished"
          value={parseDate(citations.date)}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="journalName" className="mt-5 text-sm">
          Journal Name
        </label>
        <input
          id="journalName"
          value={citations.journal_title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="publisher" className="mt-5 text-sm">
          Publisher
        </label>
        <input
          id="publisher"
          value={citations.publisher_name}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="url" className="mt-5 text-sm">
          Article URL Link
        </label>
        <a
          id="url"
          href={citations.url_link}
          target="_blank"
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        >
          {citations.url_link}
        </a>
        <h2 className="text-1xl mt-10 font-semibold">Citations Details</h2>
        <hr className="my-2 bg-gray-700" />
        <label htmlFor="citedResearch" className="mt-5 text-sm">
          Research Title that cited your work
        </label>
        <input
          id="citedResearch"
          value={citations.cited_article_title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="citedAuthors" className="mt-5 text-sm">
          Authors of the research that cited your work
        </label>
        <input
          id="citedAuthors"
          value={citations.cited_authors}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        {citations.scopus_link && (
          <>
            <label htmlFor="url" className="mt-5 text-sm">
              Scopus Link
            </label>
            <a
              id="url"
              href={citations.scopus_link}
              target="_blank"
              className="w-auto break-all border-b border-b-slate-600 py-1 ps-1 text-start text-sm"
            >
              {citations.scopus_link}
            </a>
          </>
        )}

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

export default CitationsForm;
