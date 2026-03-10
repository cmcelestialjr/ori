import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles, type TableType } from "./constants";
import { AiFillEdit, AiOutlineLoading3Quarters } from "react-icons/ai";
import UpdateParticipationPointsModal from "../components/UpdatePointsModal";

type ParticipationTableType = {
  data: TableType[];
  loading: boolean;
  handleUpdate: () => void;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setSelectedResearch: React.Dispatch<React.SetStateAction<number | null>>;
};
const ParticipationTable = ({
  data,
  loading,
  handleUpdate,
  points,
  setPoints,
  setSelectedResearch,
}: ParticipationTableType) => {
  const [openModal, setOpenModal] = useState(false);

  const columns: TableColumn<TableType>[] = [
    {
      name: "Attendance Nature",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Coverage",
      selector: (row) => row.coverage,
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
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="cursor-pointer rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700"
            onClick={() => {
              setOpenModal(true);
              setSelectedResearch(row.id);
              setPoints(
                data.find((item) => item.id === row.id)?.points as number,
              );
            }}
          >
            <AiFillEdit size={20} />
          </button>
        </div>
      ),
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

export default ParticipationTable;
