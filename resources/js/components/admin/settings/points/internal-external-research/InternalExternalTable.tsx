import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import UpdateParticipationPointsModal from "../components/UpdatePointsModal";

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

type TableType = {
  research_involvement: string;
  points: number;
  legend: string;
  ceiling_points: number | null;
  ceiling_points_legend: string | null;
};

type DataTableType = {
  data: TableType[];
  loading: boolean;
  handleUpdate: () => void;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setSelectedResearch: React.Dispatch<React.SetStateAction<number | null>>;
};
const InternalExternalTable = ({
  data,
  loading,
  handleUpdate,
  points,
  setPoints,
  setSelectedResearch: _setSelectedResearch,
}: DataTableType) => {
  const [openModal, setOpenModal] = useState(false);

  const columns: TableColumn<TableType>[] = [
    {
      name: "Research Involvement",
      selector: (row) => row.research_involvement,
      sortable: true,
    },
    {
      name: "Points",
      selector: (row) => row.points,
      sortable: true,
    },
    {
      name: "Legend",
      selector: (row) => row.legend,
      sortable: true,
    },
    {
      name: "Ceiling Points",
      cell: (row) =>
        row.ceiling_points
          ? row.ceiling_points + " " + row.ceiling_points_legend
          : "-",
      sortable: true,
    },
  ];

  return (
    <>
      <div className="bg-slate-50 rounded-lg bg-white p-6 shadow-custom">
        <div className="overflow-hidden rounded-md border">
          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10]}
            progressPending={loading}
            progressComponent={
              <h2 className="duration-300 animate-spin transition-all">
                <AiOutlineLoading3Quarters />
              </h2>
            }
            highlightOnHover
            striped
            customStyles={customStyles}
          />
        </div>
      </div>
      <UpdateParticipationPointsModal
        onConfirm={() => {
          setOpenModal(false);
          handleUpdate();
        }}
        onCancel={() => {
          setOpenModal(false);
          setPoints(0);
        }}
        message="Update Participation Points"
        points={points}
        setPoints={setPoints}
        isOpen={openModal}
      />
    </>
  );
};

export default InternalExternalTable;
