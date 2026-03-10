import { ConditionalStyles, TableColumn } from "react-data-table-component";
import { researchMonitoringForm, STATUS_TYPE } from "../../shared/types/types";
import { parseDate } from "../../util/parseDate";

type ConditionalStylesType = { status: string };

export const conditionalRowStyles: ConditionalStyles<ConditionalStylesType>[] =
  [
    {
      when: (row) => row.status === STATUS_TYPE.PENDING,
      style: {
        backgroundColor: "#fde68a",
        color: "#854d0e",
      },
    },
    {
      when: (row) => row.status === STATUS_TYPE.APPROVED,
      style: {
        backgroundColor: "#bfdbfe",
        color: "#1e40af",
      },
    },
    {
      when: (row) => row.status === STATUS_TYPE.EVALUATED,
      style: {
        backgroundColor: "#bbf7d0",
        color: "#166534",
      },
    },
    {
      when: (row) => row.status === STATUS_TYPE.REJECT,
      style: {
        backgroundColor: "#fecaca",
        color: "#991b1b",
      },
    },
  ];

export const MonitoringFormTable: TableColumn<researchMonitoringForm>[] = [
  {
    name: "id",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Research Involvement Type",
    selector: (row) => row.researchinvolvement.research_involvement_type,
    sortable: true,
  },
  {
    name: "Submitted At",
    selector: (row) => parseDate(row.created_at) || "",
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
  },
  {
    name: "Reviewed At",
    selector: (row) => parseDate(row.reviewed_at) || "",
    sortable: true,
  },
  {
    name: "Reviewed By",
    selector: (row) => row.reviewed_by || "",
    sortable: true,
  },
  {
    name: "Points",
    selector: (row) => row.points.points,
    sortable: true,
  },
];
