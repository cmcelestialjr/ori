import {  useEffect, useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query";
import { AcademicYearType } from "../../hooks/useFetchDate";

interface SubmissionPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string | undefined,
  endDate: string | undefined,
  refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AcademicYearType | null, Error>>
}

const SubmissionPeriodModal: React.FC<SubmissionPeriodModalProps> = ({ isOpen, onClose, startDate: sDate, endDate: eDate, refetch }) => {
  const [duration, setDuration] = useState(0);
  const [formattedRange, setFormattedRange] = useState("");
  const { formState: { errors }, handleSubmit, register, watch, setValue } = useForm<Pick<SubmissionPeriodModalProps, "startDate" | "endDate">>({ defaultValues: {
    startDate: "",
    endDate: "",
    
  }});

  const startDate = watch("startDate")
  const endDate = watch("endDate")


  useEffect(() => {

    setValue("endDate", eDate);
    setValue("startDate", sDate);

  }, [])


  useEffect(() => {

    if(!startDate || !endDate) return

    calculateDuration(startDate, endDate)

  }, [startDate, endDate])

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) {
      setDuration(0);
      setFormattedRange("");
      return;
    }

    const startObj = new Date(start);
    const endObj = new Date(end);

    if (endObj < startObj) {
      setDuration(0);
      setFormattedRange("Invalid date range");
      return;
    }

    const diffInDays = (endObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24) + 1;
    setDuration(diffInDays);

    const formatted = `${startObj.toLocaleDateString("en-US", { month: "long", day: "numeric" })} - 
      ${endObj.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;

    setFormattedRange(formatted);
  };

  // Check if the submission period is active
  const checkSubmissionStatus = (): "Active" | "Inactive" => {

    
    if (!startDate || !endDate) return "Inactive";

    const currentDate = new Date();
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    return currentDate >= startObj && currentDate <= endObj ? "Active" : "Inactive";
  };

  const onSubmit = async () => {

    if (!startDate || !endDate) {
      alert("All fields are required.");
      return;
    }

    const academicYear = `${new Date(startDate).getFullYear()}-${new Date(endDate).getFullYear()}`;

      await api.put("/api/academic-years/1", {
        academic_year: academicYear,
        start_date: startDate,
        end_date: endDate,
      });

      refetch()
      onClose();
    }
  

  if (!isOpen) return null; // Prevents rendering when modal is closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-medium">Research Submission Period Management</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Status Display */}
          <div className="mb-6 flex items-center justify-between">
            <span className="mr-3">Status:</span>
            <span className={`font-semibold ${checkSubmissionStatus() === "Active" ? "text-green-600" : "text-red-600"}`}>
              {checkSubmissionStatus()}
            </span>
          </div>

          {/* Start & End Date Inputs */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                {...register("startDate", { required: "Starting date is required", valueAsDate: true,validate: (value, formValues) => {
                  if (
                    formValues.endDate &&
                    value &&
                    value >= formValues.endDate
                  ) {
                    return "Start date must be before ending date";
                  }
                  return true;
                },})}
                className="w-full cursor-pointer appearance-none rounded-md border bg-white p-3 hover:border-blue-500"
              />
              <p className="text-red-500 mt-1">{errors.startDate?.message}</p>
            </div>
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                
                {...register("endDate", { required: "End date is required", valueAsDate: true, validate: (value, formValues) => {
                  if (
                    formValues.startDate &&
                    value &&
                    value <= formValues.startDate
                  ) {
                    return "End date must be after starting date";
                  }
                  return true;
                },})}
                className="w-full cursor-pointer appearance-none rounded-md border bg-white p-3 hover:border-blue-500"
              />
              <p className="text-red-500 mt-1">{errors.endDate?.message}</p>
            </div>
          </div>

          {/* Duration Display */}
          <div className="mt-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">Duration</label>
            <div className="flex flex-col rounded-md border p-3">
              <span className="text-lg font-medium">
                {duration > 0 ? `${duration.toFixed()} days` : "Select valid dates"}
              </span>
              <span className="text-sm text-gray-500">{formattedRange}</span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end border-t p-4">
            <button
              type="button"
              className="mr-2 rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <FaCheck className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionPeriodModal;
