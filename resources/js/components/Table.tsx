import DataTable, { TableColumn } from "react-data-table-component";
import { researchData } from "./util/SampleData";
import { useState } from "react";

type Data = {
  Date: string;
  Title: string;
  Author: string;
  TypeOfSubmission: string;
  Status: string;
};

const columns: TableColumn<Data>[] = [
  {
    name: "Date",
    selector: (row) => row.Date,
    sortable: true,
  },
  {
    name: "Title",
    selector: (row) => row.Title,
    sortable: true,
  },
  {
    name: "Author",
    selector: (row) => row.Author,
    sortable: true,
  },
  {
    name: "Type of Submission",
    selector: (row) => row.TypeOfSubmission,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.Status,
    sortable: true,
  },
];

const customStyles = {
  rows: {
    style: {
      fontSize: "1rem",
      backgroundColor: "#fff",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    },
  },
  headCells: {
    style: {
      fontSize: "1rem",
      backgroundColor: "#f3f4f6",
    },
  },
  cells: {
    style: {
      fontSize: "1rem",
    },
  },
};

const ResearchTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <div className="bg-slate-50 rounded-lg bg-white p-6 shadow-custom">
      <div className="overflow-hidden rounded-md border">
        <DataTable
          columns={columns}
          data={researchData}
          pagination
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={[5, 10, 20]}
          onChangeRowsPerPage={setRowsPerPage}
          highlightOnHover
          striped
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default ResearchTable;
