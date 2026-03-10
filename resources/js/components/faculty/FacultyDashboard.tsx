import Card from "../sidebar/Card";
import { Link, useNavigate } from "react-router-dom";
import { LuFileChartColumn, LuFileDigit, LuFileStack } from "react-icons/lu";
import { parseDate } from "../util/parseDate";
import { useFacultyDashboard } from "../admin/monitoring-form/hooks/hook";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import DataTable, { TableColumn } from "react-data-table-component";
import { ResearchMonitoringForm } from "../admin/types";
import Badge from "../shared/components/Badge";

const FacultyDashboard = () => {
  const { data, isLoading: loading } = useFacultyDashboard();
  const navigate = useNavigate();

  const column: TableColumn<ResearchMonitoringForm>[] = [
    {
      name: "Research Involvement Type",
      cell: (row) => (
        <p className="capitalize">
          {row.researchinvolvement.research_involvement_type}
        </p>
      ),
    },
    {
      name: "Date Submitted",
      cell: (row) => parseDate(row.created_at),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <>
          <Badge type={row.status} />
        </>
      ),
    },
    {
      name: "Points",
      selector: (row) => row.points.points,
      sortable: true,
    },
    {
      name: "Rating",
      cell: (row) => <p className="capitalize">{row.points.rating}</p>,
    },
  ];

  return (
    <section className="mx-auto grid max-w-7xl auto-cols-[minmax(0,2fr)] gap-5">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card
          borderColor="border-green-400"
          title="Total Points"
          total={data?.totalPoints}
          icon={<LuFileDigit size={30} />}
        />
        <Card
          borderColor="border-orange-400"
          title="Current Rating"
          total={data?.rating}
          icon={<LuFileChartColumn size={30} />}
        />
        <Card
          borderColor="border-yellow-400"
          title="Total Submissions"
          total={data?.totalSubmission}
          icon={<LuFileStack size={30} />}
        />
      </div>

      <div className="flex items-end justify-between">
        <h1 className="mb-3 mt-24 text-xl font-semibold">
          Recent Research Monitoring Forms
        </h1>
        <Link to="/research-monitoring-form">
          <span className="text-sm text-blue-500 hover:underline">
            See more
          </span>
        </Link>
      </div>

      <div className="rounded-md bg-white p-5 shadow-custom">
        <DataTable
          columns={column}
          data={data?.recent !== undefined ? data.recent : []}
          onRowClicked={(row) =>
            navigate(`/faculty/research-monitoring-form/${row.id}`)
          }
          pointerOnHover
          highlightOnHover
          progressComponent={
            <AiOutlineLoading3Quarters className="size-7 animate-spin" />
          }
          progressPending={loading}
        />
      </div>
    </section>
  );
};

export default FacultyDashboard;
