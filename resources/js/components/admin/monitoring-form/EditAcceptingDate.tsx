import { FormEvent, useRef } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function EditAcceptingDate() {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  // const [selectedSemester, setSelectedSemester] = useState<string>("");
  const navigate = useNavigate();

  const getAcademicYear = (startDate: string, endDate: string): string => {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    return `${startYear}-${endYear}`;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    const startDate = startDateRef.current?.value;
    const endDate = endDateRef.current?.value;

    if (!startDate || !endDate) {
      alert("All fields are required.");
      return;
    }

    const academicYear = getAcademicYear(startDate, endDate);

    // console.log(academicYear)

    try {
      await api.put("/api/academic-years/1", {
        academic_year: academicYear,
        // semester: selectedSemester,
        start_date: startDate,
        end_date: endDate,
      });

      // console.log("Success:", response.data);
      navigate("/research-monitoring/set-date");
      alert("Academic year updated successfully.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update academic year.");
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold">Research Submission Period Management</h1>

      <form onSubmit={handleSubmit}>
        <div className="mt-5 space-y-5 rounded-md bg-white p-10 shadow-custom">
          <div>
            <label
              htmlFor="start-date"
              className="block font-medium text-gray-700"
            >
              From:
            </label>
            <input
              type="date"
              ref={startDateRef}
              name="start-date"
              id="start-date"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {/* End Date Input */}
          <div>
            <label
              htmlFor="end-date"
              className="block font-medium text-gray-700"
            >
              To:
            </label>
            <input
              type="date"
              ref={endDateRef}
              name="end-date"
              id="end-date"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {/* Save Button */}
          <button
            type="submit"
            className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditAcceptingDate;
