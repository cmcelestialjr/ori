import React, { useCallback, useEffect, useState } from "react";
import api from "./components/api/axios";
import axios from "axios";
import { AiOutlineFileText } from "react-icons/ai";
import { MdCheckCircleOutline } from "react-icons/md";
import Login from "./pages/Login";
import LineChartUi from "./charts/LineChartUi";
import AreaChartUi from "./charts/SdgComparisonChart";
import { fakeAreaChartData, fakeLineChartData } from "./data/fakeData";

type Users = {
  id: number;
  fname: string;
  lname: string;
  mi: string;
  suffix: null;
  image_path: string;
  academic_rank: string;
  unit: string;
  college: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
};

export const Tests: React.FC = () => {
  const [faculty, setFaculty] = useState<Users[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [total, setTotal] = useState(0);

  // State for filter parameters
  const [filters, setFilters] = useState({
    fname: "",
    lname: "",
    college: "",
  });

  // Function to fetch faculty data with filters and pagination
  const fetchFaculty = useCallback(
    async (page = 1, rowsPerPage = perPage) => {
      const controller = new AbortController(); // Create an AbortController
      const signal = controller.signal; // Get the signal to cancel the request if needed

      try {
        // Send the filters as query params
        const response = await api.get("/api/users", {
          params: {
            paginate: rowsPerPage,
            page: page,
            ...filters, // Spread the filters into the params
          },
          signal, // Attach the signal to the request
        });

        const { data, current_page, last_page, per_page, total } =
          response.data;
        setFaculty(data);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setPerPage(per_page);
        setTotal(total);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled From Test", error.message);
        } else {
          console.error("Failed to fetch faculty data:", error);
        }
      }

      // Cleanup function: Abort the request when the effect cleans up
      return () => controller.abort();
    },
    [perPage, filters], // Dependencies of fetchFaculty
  );

  useEffect(() => {
    // Start fetching the data when the component is mounted or when dependencies change
    fetchFaculty(1, perPage);

    // Cleanup: return the cleanup function that will be called when the effect cleans up
    return () => {
      console.log("Cleanup: Cancelling ongoing request...");
    };
  }, [fetchFaculty, perPage]);

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof filters,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchFaculty(page);
  };

  // Handle rows per page change
  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(event.target.value, 10);
    setPerPage(newPerPage);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-xl font-bold">Faculty List</h1>

      {/* Filter Input Fields */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="First Name"
            value={filters.fname.trim()}
            onChange={(e) => handleFilterChange(e, "fname")}
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={filters.lname.trim()}
            onChange={(e) => handleFilterChange(e, "lname")}
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            type="text"
            placeholder="College"
            value={filters.college.trim()}
            onChange={(e) => handleFilterChange(e, "college")}
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Rows per page dropdown */}
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center">
          <span className="mr-2 text-sm">Rows per page:</span>
          <select
            value={perPage}
            onChange={handlePerPageChange}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
        <p className="text-sm">
          Showing {faculty.length} of {total} entries
        </p>
      </div>

      {/* Faculty Table */}
      <table className="mx-auto w-[90%] bg-slate-100 text-left">
        <thead>
          <tr className="border border-gray-600">
            <th>Name</th>
            <th>Academic Rank</th>
            <th>Unit</th>
            <th>College</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((user) => (
            <tr key={user.id} className="border border-gray-600">
              <td>
                {user.lname}, {user.fname} {user.mi}
              </td>
              <td>{user.academic_rank}</td>
              <td>{user.unit}</td>
              <td>{user.college}</td>
              <td>{user.email}</td>
              <td>
                <button>edit</button>
                <button>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(1)} // Navigate to first page
          disabled={currentPage === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)} // Navigate to previous page
          disabled={currentPage === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {lastPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)} // Navigate to next page
          disabled={currentPage === lastPage}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(lastPage)} // Navigate to last page
          disabled={currentPage === lastPage}
        >
          Last
        </button>
      </div>

      <AiOutlineFileText className="text-3xl text-blue-600" />
      <MdCheckCircleOutline className="text-3xl text-green-500" />

      <Login />

      <div>
        <LineChartUi data={fakeLineChartData} />
      </div>

      <div>
        <AreaChartUi data={fakeAreaChartData} />
      </div>
    </div>
  );
};
