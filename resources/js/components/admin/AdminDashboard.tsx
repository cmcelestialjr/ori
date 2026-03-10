import Card from "../sidebar/Card";
import { MdCheckCircleOutline, MdOutlineCalendarMonth } from "react-icons/md";
import { parseDate } from "../util/parseDate";
import Badge from "../shared/components/Badge";
import { DashboardCard } from "../../constant/CardData";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import LineChartUi from "../../charts/LineChartUi";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAdminDashboard } from "./monitoring-form/hooks/hook";

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  const DashboardCardData: DashboardCard[] = [
    {
      title: "Total Submission",
      border: "border-indigo-600",
      total: data?.total_count,
      icon: <MdOutlineCalendarMonth className="text-indigo-600" size={60} />,
    },
    {
      title: "Total Users",
      border: "border-yellow-600",
      total: data?.total_users,
      icon: <FaUsers className="text-yellow-600" size={60} />,
    },
    {
      title: "Highest Points",
      border: "border-blue-600",
      total: !data?.highest_points.name ? "N/A" : data?.highest_points.name,
      icon: data?.highest_points.total_points
        ? data?.highest_points.total_points
        : "",
    },
    {
      title: "Evaluated Submission",
      border: "border-pink-600",
      total: data?.total_evaluated,
      icon: <MdCheckCircleOutline size={60} className="text-pink-600" />,
    },
  ];

  return (
    <section className="mx-auto grid max-w-7xl auto-cols-[minmax(0,2fr)] gap-5">
      <div>
        <h1 className="mt-5 text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {DashboardCardData.map((data, i) => (
          <Link
            to={
              i === 1 || i === 2
                ? "/manage-faculty"
                : "/research-monitoring/submissions"
            }
          >
            <Card
              key={data.title}
              title={data.title}
              total={data.total}
              name={data.name ?? null}
              borderColor={data.border}
              icon={data.icon}
            />
          </Link>
        ))}
      </div>

      <hr className="mb-5 border-t-2 border-slate-300" />

      <div className="grid grid-cols-1">
        <LineChartUi data={data?.charts} />
        {/* <AreaChartUi data={data?.sdg_charts ? data.sdg_charts : []} /> */}
      </div>

      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-text1Color">
          Recent Approved Research Submission
        </h1>
      </div>
      <div className="overflow-x-scroll rounded-md bg-white p-5 shadow-custom">
        <div className="rounded-md border-2 border-gray-100">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Research Involvement Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  College
                </th>
                <th scope="col" className="px-6 py-3">
                  Submitted at
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
              {data?.recent_approved.map((data) => (
                <tr
                  key={data.id}
                  className="cursor-pointer select-text border-b-2 border-gray-100 bg-white last:border-none hover:bg-gray-100"
                >
                  <td className="px-6 py-3 font-semibold capitalize">
                    <Link to={`/research-monitoring/${data.id}`}>
                      {data.researchinvolvement.research_involvement_type}
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    <Link to={`/research-monitoring/${data.id}`}>
                      {data.users.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    <Link to={`/research-monitoring/${data.id}`}>
                      {data.users.college}
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    <Link to={`/research-monitoring/${data.id}`}>
                      {parseDate(data.created_at)}
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    <Link to={`/research-monitoring/${data.id}`}>
                      <Badge type={data.status} />
                    </Link>
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    <Link to={`/research-monitoring/${data.id}`}>
                      {data.points.points}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isLoading && data?.recent_approved.length === 0 && (
            <p className="my-4 p-1 text-center font-semibold text-gray-500">
              No records to display.
            </p>
          )}

          {isLoading && (
            <div className="my-5 p-1">
              <LoadingSpinner />
            </div>
          )}
        </div>
        {/* <SubmissionPeriodModal /> */}
      </div>
    </section>
  );
}
