import { Link } from "react-router-dom";
import useAgenda from "../../../../hooks/useAgendaMapping";
import api from "../../../api/axios";

// --- FIX: Robust Helper to fix ALL broken URLs ---
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/150";
  
  if (path.startsWith("http")) {
      if (path.includes("localhost") || path.includes("127.0.0.1")) {
         return path.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "http://localhost:8000");
      }
      return path;
  }

  return `http://localhost:8000/storage/${path}`; 
};

export default function AgendaMapping() {
  const { agenda, isLoading } = useAgenda();

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Agenda?");
    if (isConfirmed) {
      try {
        await api.delete(`/api/agendamapping/${id}`);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting Agenda:", error);
        alert("Failed to delete Agenda.");
      }
    }
  };

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h1>Agenda Mapping</h1>
        <Link
          className="rounded-md bg-blue-700 font-semibold text-white hover:bg-blue-600"
          to="/admin-settings/agenda-mapping/add-agenda"
        >
          <div className="flex items-center px-4 py-2">
            {/* SVG Plus Icon replaces IoMdAdd */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="h-1 w-1"></span>
            <p>New Agenda</p>
          </div>
        </Link>
      </div>

      {/* =======================================! Table !======================================= */}
      <div className="rounded-md bg-white p-5 shadow-custom">
        <div className="overflow-x-auto rounded-md border-2 border-gray-100">
          <table className="w-full table-auto text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th scope="col" className="w-[3%] px-6 py-3">
                  No
                </th>
                <th scope="col" className="w-[15%] px-6 py-3">
                  Image
                </th>
                <th scope="col" className="w-[50%] px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {agenda &&
                agenda.map((data, index) => (
                  <tr
                    key={data.id}
                    className="select-text border-b-2 border-gray-100 bg-white last:border-none hover:bg-gray-100"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">
                      <Link to={`/admin-settings/agenda-mapping/edit-agenda/${data.id}`} title="Click to Change Image">
                        <img 
                          src={getImageUrl(data.image_path)}  
                          alt="Agenda" 
                          loading="lazy" 
                          className="h-auto max-w-[100px] cursor-pointer rounded-md object-cover hover:opacity-80"
                          onError={(e) => {
                             e.currentTarget.src = "https://via.placeholder.com/150?text=Add+Image";
                          }}
                        />
                      </Link>
                    </td>
                    <td className="px-6 py-3 font-semibold">{data.name}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <Link
                          to={`/admin-settings/agenda-mapping/edit-agenda/${data.id}`}
                          className="flex w-fit items-center justify-center rounded-md bg-green-600 p-2 text-white hover:bg-green-500"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(data.id)}
                          className="flex w-fit items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-500"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isLoading && (
          <p className="mt-4 p-1 text-center font-semibold text-gray-500">
            loading...
          </p>
        )}
        {!isLoading && agenda.length === 0 && (
          <p className="mt-4 p-1 text-center font-semibold text-gray-500">
            No records to display. Please add an Agenda
          </p>
        )}
      </div>
    </section>
  );
}