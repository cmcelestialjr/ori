import React, { useState } from "react";
import {
  Publishedresearchprod,
  STATUS_TYPE,
  type Researchdocument,
} from "../../shared/types/types";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../hooks/useUpdateMonitoringForm";
import { useNavigate } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import pdfThumbnail from "../../../assets/images/pngwing.com.png";
import { imageMimeType } from "../../util/ImageMimeTypes";
import { parseDate } from "../../util/parseDate";
import { useMonitoringFormContext } from "../../shared/hooks/useMonitoringFormContext";

type PublishedResearchFormProps = {
  published: Publishedresearchprod;
  documents: Researchdocument[];
  formStatus: string;
};

type statusType = {
  [key: number]: string;
};

const PublishedResearchForm = ({
  published,
  documents,
  formStatus,
}: PublishedResearchFormProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [status, setStatus] = useState<statusType>({});
  const { refetchData } = useMonitoringFormContext();

  const {
    error,
    isLoading: loading,
    mutate: updateMonitoringForm,
  } = useUpdateMonitoringForm();

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: number,
  ) => {
    setStatus((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const handleClick = async () => {
    setOpenModal(false);

    const variables: UpdateMonitoringFormVariables = {
      id: published.researchmonitoringform_id,
      status: Object.values(status),
      isAdmin: false,
      rejected_message: "",
    };
    await updateMonitoringForm(variables);
    navigate("/coordinator-dashboard");
    refetchData();
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
          Article Title
        </label>
        <input
          id="Activity/Seminar/Research Title"
          value={published.research.title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm"
        />
        <label
          htmlFor="Activity/Seminar/Research Title"
          className="mt-5 text-sm"
        >
          Authors
        </label>
        <input
          id="Activity/Seminar/Research Title"
          value={published.research.authors}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm"
        />
        <label htmlFor="date" className="mt-5 text-sm">
          Published Date
        </label>
        <input
          id="date"
          value={parseDate(published.date)}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm"
        />
        <label htmlFor="organizer" className="mt-5 text-sm">
          Journal Name
        </label>
        <input
          id="organizer"
          value={published.journal_name}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm"
        />
        <label htmlFor="coverage" className="mt-5 text-sm">
          Publisher Name
        </label>
        <input
          id="coverage"
          value={published.editor_publisher}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm"
        />
        <label htmlFor="articleLink" className="mt-5 text-sm">
          Article link
        </label>
        <a
          id="articleLink"
          href={published.article_link}
          target="_blank"
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm hover:underline"
        >
          {published.article_link}
        </a>
        <label htmlFor="fundSource" className="mt-5 text-sm">
          ISSN
        </label>
        <input
          id="fundSource"
          value={published.issno_vol_pages}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm"
        />
        <label htmlFor="index" className="mt-5 text-sm">
          Indexing
        </label>
        <input
          id="index"
          value={published.indexing}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm"
        />

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
        message="Are you sure you want to update?"
        onCancel={() => setOpenModal(false)}
        type="submit"
        onConfirm={handleClick}
      />
    </>
  );
};

export default PublishedResearchForm;
