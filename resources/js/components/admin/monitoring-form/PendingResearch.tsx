import { IoSearch } from "react-icons/io5";
import { parseDate } from "../../util/parseDate";
import { Link } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import useFetchAdminResearchMonitoringForm from "../../../hooks/useFetchAdminResearchMonitoringForm";

export default function PendingResearch() {
  const { approvedResearch, isLoading } = useFetchAdminResearchMonitoringForm();

  const pending = approvedResearch.filter((data) => data.status === "pending");

  return (
    <section className="grid gap-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Recent Submission</h1>
        <div className="flex items-center">
          <input
            type="search"
            placeholder={"Search for..."}
            className="w-[16rem] rounded-l-md border-2 border-r-0 border-slate-400 p-1 pl-5 text-base focus:outline-none"
          />
          <IoSearch
            size={35.7}
            className="rounded-r-md bg-blue-700 p-[3px] text-white"
          />
        </div>
      </div>

      <div className="rounded-md bg-white p-5 shadow-custom">
        <div className="mx-auto max-w-[1050px] overflow-hidden rounded-md border-2 border-gray-100">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-sm">
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
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {approvedResearch &&
                pending.map((data) => (
                  <tr
                    key={data.id}
                    className="select-text border-b-2 border-gray-100 bg-white last:border-none hover:bg-gray-100"
                  >
                    <td className="px-6 py-3 font-semibold">
                      {data.users.lname}
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      {data.users.unit}
                    </td>
                    <td className="cursor-pointer px-6 py-3 font-semibold">
                      <Link
                        to={`/research-monitoring/${data.id}`}
                        className="text-center font-semibold hover:underline"
                      >
                        {data.researchinvolvement.research_involvement_type}
                      </Link>
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      {parseDate(data.created_at)}
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      <Badge type={data.status} />
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      {data.points?.points}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!isLoading && approvedResearch && pending.length === 0 && (
            <p className="my-4 p-1 text-center font-semibold text-gray-500">
              No records to display.
            </p>
          )}

          {isLoading && (
            <p className="my-5 p-1 text-center font-semibold text-gray-500">
              Loading...
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
