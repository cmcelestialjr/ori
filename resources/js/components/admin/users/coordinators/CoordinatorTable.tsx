// table
import DataTable, { TableColumn } from "react-data-table-component";
import { useState } from "react";

// react icon
import { AiFillEdit, AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserDataTable } from "../../types";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import api from "../../../api/axios";

type CoordinatorProps = {
  data: UserDataTable[];
  filter: (id: number) => void;
  loading: boolean;
};

const CoordinatorTable: React.FC<CoordinatorProps> = ({
  data,
  filter,
  loading,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/coordinators/${id}`);
      filter(id);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const columns: TableColumn<UserDataTable>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Academic Rank",
      selector: (row) => row.academic_rank,
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
    },
    {
      name: "College",
      selector: (row) => row.college,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Coordinator",
      cell: (row) => (
        <span
          className={`${!row.coordinator ? "text-red-700" : "text-green-700"}`}
        >
          {!row.coordinator ? "revoked" : "active"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/coordinator/${row.id}/edit`}
            className="cursor-pointer rounded-md bg-blue-700 p-1 text-white"
          >
            <AiFillEdit size={20} />
          </Link>
          <button
            onClick={async () => {
              setSelectedUserId(row.id);
              setOpenModal(true);
            }}
            className="cursor-pointer rounded-md bg-red-600 p-1 text-white"
          >
            <MdDelete size={20} />
          </button>
        </div>
      ),
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

  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <div className="overflow-x-scroll rounded-lg bg-secondary p-6 shadow-custom scrollbar-thin scrollbar-track-[#f1f1f1] scrollbar-thumb-[#c1c1c1]">
      <div className="overflow-hidden rounded-md border">
        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={[5, 10, 20]}
          onChangeRowsPerPage={setRowsPerPage}
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
      <ConfirmationModal
        isOpen={openModal}
        message="Are you sure you want to delete this coordinator?"
        onCancel={() => setOpenModal(false)}
        onConfirm={() => {
          if (selectedUserId) {
            handleDelete(selectedUserId);
            setOpenModal(false);
          }
        }}
        type="submit"
      />
    </div>
  );
};

export default CoordinatorTable;
