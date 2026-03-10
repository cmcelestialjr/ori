import { parseDate } from "../util/parseDate";
import { Link } from "react-router-dom";
import { useMonitoringFormContext } from "../shared/hooks/useMonitoringFormContext";
import { useEffect, useRef } from "react";
import { STATUS_TYPE } from "../shared/types/types";
import Pagination from "../shared/components/Pagination";
import { IoSearch } from "react-icons/io5";

const ApprovedMonitoringForm = () => {
  const {
    coordinatorData: approved,
    setParams,
    refetchData,
    loading,
  } = useMonitoringFormContext();

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setParams((prev) => ({ ...prev, status: STATUS_TYPE.APPROVED }));
    refetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setParams((prev) => ({
      ...prev,
      status: STATUS_TYPE.APPROVED,
      search: ref.current?.value as string,
    }));

    refetchData();
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };
  return (
    <section>
      <h1 className="text-2xl font-semibold">Approved Submissions</h1>

      <form
        onSubmit={handleSubmit}
        className="my-2 flex items-center justify-end pt-10"
      >
        <div className="flex space-x-10">
          <div className="flex items-center">
            <input
              type="search"
              placeholder="Search for..."
              className="w-[16rem] rounded-l-md border-2 border-r-0 border-slate-400 p-[6px] pl-5 text-base focus:outline-none"
              ref={ref}
            />
            <button type="submit">
              <IoSearch
                size={40}
                className="rounded-r-md bg-blue-700 p-[px] text-white"
              />
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-md mt-10 h-5 animate-bounce transition-all duration-300">
          Loading...
        </div>
      ) : (
        <>
          <div className="relative shadow-md sm:rounded-lg">
            <table className="w-full overflow-clip text-left text-sm text-gray-500 rtl:text-right">
              <thead className="relative bg-gray-50 font-sans text-sm text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Unit
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Research Involvement Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date Submitted
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date Approved
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Points
                  </th>
                </tr>
                {loading && (
                  <div className="absolute bottom-0 h-1 w-20 animate-loading rounded-sm bg-blue-500"></div>
                )}
              </thead>
              <tbody>
                {approved.forms.data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b bg-white hover:bg-gray-100"
                  >
                    <td className="px-6 py-3">
                      {item.users.fname.concat(
                        " ",
                        item.users.mi ? item.users.mi + ". " : " ",
                        item.users.lname,
                        " ",
                        item.users.suffix ? item.users.suffix : "",
                      )}
                    </td>
                    <td className="px-6 py-3">{item.users.unit}</td>
                    <td className="cursor-pointer px-6 py-3 capitalize hover:underline">
                      <Link to={`/research-monitoring-form/${item.id}`}>
                        {item.researchinvolvement.research_involvement_type}
                      </Link>
                    </td>
                    <td className="px-6 py-3">{parseDate(item.created_at)}</td>
                    <td className="px-6 py-3">{parseDate(item.reviewed_at)}</td>
                    <td className="px-6 py-3">{item.points?.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex w-full justify-end">
            <Pagination
              currentPage={approved.forms.paginationData.current_page}
              onPageChange={handlePageChange}
              totalPages={approved.forms.paginationData.last_page}
              links={approved.forms.paginationData.links}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default ApprovedMonitoringForm;
