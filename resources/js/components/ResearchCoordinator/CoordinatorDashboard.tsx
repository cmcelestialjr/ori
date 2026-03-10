import Card from "../sidebar/Card";
import Badge from "../shared/components/Badge";
import { parseDate } from "../util/parseDate";
import { Link } from "react-router-dom";
import { FaRegFileExcel } from "react-icons/fa";
import { LuFileCheck, LuFileClock } from "react-icons/lu";
import { useMonitoringFormContext } from "../shared/hooks/useMonitoringFormContext";
import { useEffect } from "react";

const CoordinatorDashboard = () => {
  const { coordinatorData, loading, refetchData, setParams } =
    useMonitoringFormContext();

  const { forms } = coordinatorData;
  console.log("DASHBOARD DATA:", coordinatorData);
  useEffect(() => {
    setParams((prev) => ({ ...prev, status: "all" }));
    refetchData();
  }, []);
  return (
    <section className="mx-auto grid max-w-7xl auto-cols-[minmax(0,2fr)] gap-5">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {/* <div className="mt-8 flex items-center justify-start space-x-10"> */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Link to="/pending">
          <Card
            borderColor="border-yellow-400"
            title="Total Pending"
            total={coordinatorData.totalPending}
            icon={<LuFileClock size={30} />}
          />
        </Link>
        <Link to="/approved">
          <Card
            borderColor="border-blue-400"
            title="Total Approved"
            total={coordinatorData.totalApproved}
            icon={<LuFileCheck size={30} />}
          />
        </Link>
        <Card
          borderColor="border-red-400"
          title="Total Rejected"
          total={coordinatorData.totalRejected}
          icon={<FaRegFileExcel size={30} />}
        />
      </div>
      <div className="relative overflow-x-auto py-16">
        {loading ? (
          <div className="text-md flex items-center justify-center font-normal">
            Loading...
          </div>
        ) : (
          <>
            <h1 className="mb-3 text-xl font-semibold">
              Recent Research Monitoring Forms
            </h1>
            <table className="w-full text-left font-sans text-sm text-gray-500 rtl:text-right">
              <thead className="bg-gray-50 text-sm text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
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
                    Date Reviewed
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(forms?.data) &&
                  forms.data.slice(0, 6).map((item) => (
                    <tr
                      key={item.id}
                      className="select-text border-b bg-white hover:bg-gray-100"
                    >
                      <td className="px-6 py-3">
                        {item.users
                          ? `${item.users.fname} ${item.users.lname}`
                          : "Unknown"}
                      </td>
                      <td className="cursor-pointer px-6 py-3 capitalize hover:underline">
                        <Link to={`/research-monitoring-form/${item.id}`}>
                          {item.researchinvolvement
                            ?.research_involvement_type || "N/A"}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        {parseDate(item.created_at)}
                      </td>
                      <td className="cursor-default px-6 py-3">
                        <Badge type={item.status} />
                      </td>
                      <td className="px-6 py-3">
                        {parseDate(item.reviewed_at)}
                      </td>
                      <td className="px-6 py-3"></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
};

export default CoordinatorDashboard;
