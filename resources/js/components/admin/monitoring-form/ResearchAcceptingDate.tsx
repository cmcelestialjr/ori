import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { DateCard } from "../DateCard";
import { calculateDuration } from "../../util/calculateDuration";
import { formattedDate } from "../../util/fomattedDate";
import { formattedDateRange } from "../../util/formattedDateRange";
import { HiArchive, HiPencil } from "react-icons/hi";
import SubmissionPeriodModal from "../../ui/SubmissionPeriodModal";
import useFetchDate from "../../../hooks/useFetchDate";
import api from "../../api/axios";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import { useArchiveResearchMutation } from "./hooks/hook";

const ResearchAcceptingDate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    modal: boolean;
    archiveModal: boolean;
  }>({ modal: false, archiveModal: false });
  const [nextStatus, setNextStatus] = useState<boolean | null>(null);

  const { academicYear, refetch } = useFetchDate();
  const { mutate } = useArchiveResearchMutation();

  const duration = academicYear
    ? calculateDuration(academicYear.start_date, academicYear.end_date)
    : 0;
  const startDate = academicYear?.start_date;
  const endDate = academicYear?.end_date;

  const checkDateStatus = (dateString: string): "Active" | "Inactive" => {
    const endDate = new Date(dateString);
    const currentDate = new Date();

    endDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const status = endDate >= currentDate ? "Active" : "Inactive";

    return status;
  };

  const handleSubmissionStatus = async () => {
    if (nextStatus === null) return;

    try {
      await api.put(`/api/academic-years/${academicYear?.id}/status`, {
        submission_status: nextStatus,
      });

      setConfirmModal({ modal: false, archiveModal: false });
      setNextStatus(null);
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const handleArchive = async () => {
    try {
      await mutate();
    } catch (e) {
      console.error(e);
    }

    setConfirmModal({
      modal: false,
      archiveModal: false,
    });
  };

  return (
    <section className="grid auto-cols-[minmax(0,2fr)]">
      <SubmissionPeriodModal
        refetch={refetch}
        startDate={academicYear?.start_date}
        endDate={academicYear?.end_date}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <h1 className="mb-5 text-2xl font-semibold text-gray-800">
        Research Submission Period Management
      </h1>

      <div className="rounded-md bg-secondary p-4 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              {checkDateStatus(endDate!)}
            </div>
          </div>
          <div className="flex gap-x-5">
            <button
              onClick={() =>
                setConfirmModal({
                  modal: false,
                  archiveModal: true,
                })
              }
            >
              <div className="flex items-center rounded-lg bg-green-100 px-4 py-2 text-green-600 transition-colors hover:bg-green-200">
                <HiArchive size={22} />
                <span className="font-semibold">Archive</span>
              </div>
            </button>
            <button onClick={() => setIsModalOpen(true)}>
              <div className="flex items-center rounded-lg bg-blue-100 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-200">
                <HiPencil size={22} />
                <span className="font-semibold">Edit</span>
              </div>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <DateCard title="Start Date" date={formattedDate(startDate)} />
          <DateCard title="End Date" date={formattedDate(endDate)} />
          <DateCard
            title="Number of Days"
            date={`${duration} days`}
            duration={formattedDateRange(startDate, endDate)}
          />
        </div>

        <div className="mt-6 flex flex-row-reverse items-center justify-end gap-x-2">
          <label
            htmlFor="disable"
            className="cursor-pointer text-lg font-semibold text-gray-800"
          >
            {" "}
            Enable research submission
          </label>
          <input
            checked={academicYear?.is_submission_enable}
            type="checkbox"
            onChange={() => {
              setNextStatus(!academicYear?.is_submission_enable);
              setConfirmModal({
                modal: true,
                archiveModal: false,
              });
            }}
            className="size-5 cursor-pointer rounded-lg accent-blue-500"
            id="disable"
          />
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmModal.modal}
        type="submit"
        onCancel={() => {
          setConfirmModal({
            modal: false,
            archiveModal: false,
          });
          setNextStatus(null);
        }}
        onConfirm={() => {
          handleSubmissionStatus();
        }}
        message={`The submission period is currently ${
          academicYear?.is_submission_enable ? "enable" : "disable"
        }. Are you sure you want to ${
          academicYear?.is_submission_enable ? "disable" : "enable"
        } it?`}
      />
      <ConfirmationModal
        isOpen={confirmModal.archiveModal}
        type="submit"
        onCancel={() => {
          setConfirmModal({
            modal: false,
            archiveModal: false,
          });
          setNextStatus(null);
        }}
        onConfirm={() => handleArchive()}
        message="This will archive all evaluated research monitoring within the submission period. Are you sure you want to proceed?"
      />
    </section>
  );
};

export default ResearchAcceptingDate;
