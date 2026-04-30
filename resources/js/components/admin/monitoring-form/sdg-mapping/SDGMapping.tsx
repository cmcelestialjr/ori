import { Link } from "react-router-dom";
import useSdg from "../../../../hooks/useSdgMapping";
import api from "../../../api/axios";

// --- FIX: Robust Helper to fix ALL broken URLs ---
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://placehold.co/150x150?text=Add+Image";
  
  // 1. Handle paths that look like URLs (http://...)
  if (path.startsWith("http")) {
      // If it points to localhost or 127.0.0.1 (incorrect port), force it to port 8000
      if (path.includes("localhost") || path.includes("127.0.0.1")) {
         return path.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "http://localhost:8000");
      }
      return path; // It's an external URL, keep it
  }

  // 2. Handle relative paths (newly uploaded files)
  return `http://localhost:8000/storage/${path}`; 
};
// ----------------------------------------------------

export const SDGMapping = () => {
  const { sdg, isLoading } = useSdg();

  // Function to handle deletion
  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this SDG?");
    if (isConfirmed) {
      try {
        await api.delete(`/api/sdgmapping/${id}`);
        // Reload the page to show updated list
        window.location.reload();
      } catch (error) {
        console.error("Error deleting SDG:", error);
        alert("Failed to delete SDG.");
      }
    }
  };

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h1>SDG Mapping</h1>
        <Link
          className="rounded-md bg-blue-700 font-semibold text-white hover:bg-blue-600"
          to="/admin-settings/sdg-mapping/add-sdg"
        >
          <div className="flex items-center px-4 py-2">
            {/* SVG Icon for Add */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="h-1 w-1"></span>
            <p>Create SDG</p>
          </div>
        </Link>
      </div>

      {/* =======================================! Table !======================================= */}
      <div className="rounded-md bg-white p-5 shadow-custom">
        <div className="overflow-x-auto rounded-md border-2 border-gray-100">
          <table className="w-full table-auto text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th scope="col" className="w-[3%] px-4 py-3">
                  No
                </th>
                <th scope="col" className="w-[15%] px-4 py-3">
                  Image
                </th>
                <th scope="col" className="w-[30%] px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Description
                </th>
                {/* Added Action Column */}
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sdg &&
                sdg.map((data, index) => (
                  <tr
                    key={data.id}
                    className="border-b-2 border-gray-100 bg-white last:border-none hover:bg-gray-100"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {/* Clicking the image goes to Edit Page to Add/Change it */}
                      <Link to={`/admin-settings/sdg-mapping/edit-sdg/${data.id}`} title="Click to Add/Change Picture">
                        <img
                          src={getImageUrl(data.image_path)}
                          alt="SDG"
                          loading="lazy"
                          className="h-auto max-w-[100px] cursor-pointer rounded-md object-cover hover:opacity-80"
                          onError={(e) => {
                              // If image is missing, show a placeholder asking to Add Image
                              e.currentTarget.src = "https://placehold.co/150x150?text=Add+Image";
                          }}
                        />
                      </Link>
                    </td>
                    <td className="break-words px-4 py-3 font-semibold">
                      {data.name}
                    </td>
                    <td className="break-words px-4 py-3">
                      {data.description}
                    </td>
                    {/* Action Buttons */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Edit Button (Pencil) */}
                        <Link
                          to={`/admin-settings/sdg-mapping/edit-sdg/${data.id}`}
                          className="flex w-fit items-center justify-center rounded-md bg-green-600 p-2 text-white hover:bg-green-500"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Link>

                        {/* Delete Button (Trash) */}
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
        {!isLoading && sdg.length === 0 && (
          <p className="mt-4 p-1 text-center font-semibold text-gray-500">
            No records to display. Please add an SDG
          </p>
        )}
      </div>
    </section>
  );
};