// table
import DataTable, { TableColumn } from "react-data-table-component";
import { useState } from "react";

// react icon
import { AiFillEdit, AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserDataTable } from "../../types";
import api from "../../../api/axios";
import AddCoordinatorModal from "./AddCoordinatorModal";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import { useDeleteUser } from "../../../../hooks/hooks";

type FacultyTableProps = {
  data: UserDataTable[];
  filter: (id: number) => void;
  loading: boolean;
  refetch: () => void;
};
const FacultyTable: React.FC<FacultyTableProps> = ({
  data,
  filter,
  loading,
  refetch,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);

  const { handleDelete } = useDeleteUser();

  const handleCoordinatorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.target.checked) {
      setSelectedUserId(id);
      setOpenModal(true);
    } else {
      setSelectedUserId(id);
      setOpenConfirmationModal(true);
    }
  };

  const handleRemoveCoordinator = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    try {
      await api.delete(`/api/faculty/${selectedUserId}/remove-role`);
      setLoading(false);
      setOpenConfirmationModal(false);
      setSelectedUserId(null);
      refetch();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleAssignCoordinator = async () => {
    if (!selectedUserId) return;

    setLoading(true);

    try {
      await api.post(`/api/faculty/${selectedUserId}/update-role`);
      setLoading(false);
      setOpenModal(false);
      setSelectedUserId(null);
      refetch();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setOpenModal(false);
    setSelectedUserId(null);
  };

  const pointsSort = (rowA: UserDataTable, rowB: UserDataTable) => {
    const a = rowA.totalPoints ? rowA.totalPoints : 0;
    const b = rowB.totalPoints ? rowB.totalPoints : 0;

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
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
      name: "Coordinator",
      cell: (row) => (
        <div>
          <input
            className="cursor-pointer"
            type="checkbox"
            onChange={(e) => handleCoordinatorChange(e, row.id)}
            checked={row.coordinator}
          />
        </div>
      ),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Total Points",
      cell: (row) => (row.totalPoints ? row.totalPoints : 0),
      sortable: true,
      sortFunction: pointsSort,
    },
    {
      name: "Rating",
      cell: (row) => <p className="capitalize">{row.rating}</p>,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/faculty/${row.id}/edit`}
            className="cursor-pointer rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700"
          >
            <AiFillEdit size={20} />
          </Link>
          <button
            onClick={async () => {
              setSelectedUserId(row.id);
              setOpenDeleteModal(true);
            }}
            className="cursor-pointer rounded-md bg-red-600 p-1 text-white hover:bg-red-700"
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

  return (
    <>
      <div className="overflow-x-scroll rounded-lg bg-secondary p-6 shadow-custom scrollbar-thin scrollbar-track-[#f1f1f1] scrollbar-thumb-[#c1c1c1]">
        <div className="overflow-hidden rounded-md border">
          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20]}
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
      <AddCoordinatorModal
        faculty={data && data.find((user) => user.id === selectedUserId)}
        loading={isLoading}
        isOpen={openModal}
        onCancel={() => handleCancelModal()}
        onConfirm={() => handleAssignCoordinator()}
      />
      <ConfirmationModal
        isOpen={openConfirmationModal}
        message="Are you sure you want to remove research-coordinator role?"
        onCancel={() => setOpenConfirmationModal(false)}
        onConfirm={() => handleRemoveCoordinator()}
        type="submit"
      />
      <ConfirmationModal
        isOpen={openDeleteModal}
        message="Are you sure you want to delete user?"
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          setOpenDeleteModal(false);
          handleDelete(selectedUserId as number);
          filter(selectedUserId as number);
          setSelectedUserId(null);
        }}
        type="submit"
      />
    </>
  );
};

export default FacultyTable;
