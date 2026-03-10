import React, { useState } from "react";
import {
  STATUS_TYPE,
  type ResearchAttendance,
  type Researchdocument,
} from "../../shared/types/types";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../hooks/useUpdateMonitoringForm";
import { useNavigate } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import pdfThumbnail from "../../../assets/images/pngwing.com.png";
import { imageMimeType } from "../../util/ImageMimeTypes";
import { useMonitoringFormContext } from "../../shared/hooks/useMonitoringFormContext";
import ConfirmationModal from "../../shared/components/ConfirmationModal";

type AttendanceToResearchProps = {
  attendancetoresearch: ResearchAttendance;
  documents: Researchdocument[];
  formStatus: string;
};

type statusType = {
  [key: number]: string;
};

const AttendanceToResearch = ({
  attendancetoresearch,
  documents,
  formStatus,
}: AttendanceToResearchProps) => {
  const [status, setStatus] = useState<statusType>({});
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const { refetchData } = useMonitoringFormContext();
  const {
    mutate: updateForm,
    error,
    isLoading: loading,
  } = useUpdateMonitoringForm();

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: number,
  ) => {
    setStatus((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const handleClick = async () => {
    setOpenModal(false);
    const variables: UpdateMonitoringFormVariables = {
      id: attendancetoresearch.researchmonitoringform_id,
      status: Object.values(status),
      isAdmin: false,
      adminParams: undefined,
      rejected_message: "",
    };
    await updateForm(variables);
    refetchData();
    navigate("-1");
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
        <label htmlFor="Activity/Seminar/Research Title" className="text-sm">
          Activity/Seminar/Research Title
        </label>
        <input
          id="Activity/Seminar/Research Title"
          value={attendancetoresearch.research_title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="date" className="mt-5 text-sm">
          Date
        </label>
        <input
          id="date"
          value={attendancetoresearch.date}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="organizer" className="mt-5 text-sm">
          Organizer
        </label>
        <input
          id="organizer"
          value={attendancetoresearch.organizer}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="coverage" className="mt-5 text-sm">
          Coverage
        </label>
        <input
          id="coverage"
          value={attendancetoresearch.coverage}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="fundSource" className="mt-5 text-sm">
          Fund Source Nature
        </label>
        <input
          id="fundSource"
          value={attendancetoresearch.fund_source_nature}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <h2 className="text-1xl mb-5 mt-5 font-semibold">Documents</h2>

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
              <div className="w-2/5 space-y-1 place-self-start">
                <label
                  htmlFor={`Select-${item.id}`}
                  className="text-sm text-gray-900"
                >
                  Status
                </label>
                {formStatus == STATUS_TYPE.PENDING ? (
                  <select
                    id={`Select-${item.id}`}
                    value={status[item.id]}
                    className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleChange(e, item.id)}
                  >
                    <option selected disabled>
                      Pending
                    </option>
                    <option value={STATUS_TYPE.APPROVED}>Approve</option>
                    <option value={STATUS_TYPE.REJECT}>Reject</option>
                  </select>
                ) : (
                  <div className="flex items-center justify-start space-x-2">
                    <Badge type={item.status} />
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
        {formStatus === STATUS_TYPE.PENDING && (
          <button
            className="mt-5 place-self-end rounded-md bg-blue-500 px-5 py-2 font-semibold text-white enabled:hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setOpenModal(true)}
            disabled={
              Object.values(status).length < documents.length || loading
            }
          >
            {loading ? <span>Loading...</span> : "Update"}
          </button>
        )}
      </div>
      <ConfirmationModal
        isOpen={openModal}
        message={`Are you sure you want ${Object.values(status).includes(STATUS_TYPE.APPROVED) ? "Approve" : "Reject"} this research monitoring form?`}
        onCancel={() => setOpenModal(false)}
        onConfirm={handleClick}
        type="submit"
      />
    </>
  );
};

export default AttendanceToResearch;
