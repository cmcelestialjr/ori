import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import {
  AcademicRanksOptions,
  UnitOptions,
} from "../../../../constant/UserDropOptionsData";
import { UserType } from "../../types";
import Button from "../../../shared/components/Button";
import { useToast } from "../../../../hooks/useToast";

type FacultyFormType = Omit<
  UserType,
  "id" | "roles" | "research_monitoring_form"
>;

// --- FIX: Helper to fix broken image URLs ---
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/150";
  
  if (path.startsWith("http")) {
      // Force port 8000 if it's pointing to localhost without a port
      if (path.includes("localhost") || path.includes("127.0.0.1")) {
         return path.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "http://localhost:8000");
      }
      return path;
  }
  // Prefix relative paths
  return `http://localhost:8000/storage/${path}`; 
};
// --------------------------------------------

const FacultyDetails = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [formData, setFormData] = useState<FacultyFormType>({
    fname: "",
    lname: "",
    mi: "",
    suffix: "",
    image_path: "",
    college: "",
    unit: "",
    academic_rank: "",
    email: "",
  });

  const toast = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/users/${id}`);
        setFormData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, [id]);

  const fileUpload = async (e: { target: { files?: FileList | null } }) => {
    const formImage = new FormData();

    if (e.target.files && e.target.files[0]) {
      formImage.append("image_path", e.target.files[0]);
    }

    const res = await api.post("/api/file-upload-public", formImage, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setFormData({
      ...formData,
      image_path: res.data.data?.image_path,
    });
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
        await api.put(`/api/user/${id}`, formData);
        history("/manage-faculty");
        toast.success("User updated successfully");
    } catch (error) {
        console.error(error);
        toast.error("Failed to update user");
    }
  };

  return (
    <div>
      {formData ? (
        <div>
          <form
            onSubmit={handleUpdate}
            className="mx-auto mb-4 max-w-md rounded-md bg-white px-8 pb-8 pt-6 shadow-md"
          >
            <h1 className="mb-6 text-xl font-bold">Faculty Details</h1>
            <div>
              <img
                // --- FIX: Use helper function here ---
                src={getImageUrl(formData.image_path)}
                alt="User Profile"
                className="my-5 h-32 w-32 object-cover shadow-lg transition-shadow duration-300 hover:shadow-xl"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="file"
                className="mb-2 block font-bold text-gray-700"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={fileUpload}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full rounded-md border bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                id="lname"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full rounded-md border bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="mi">Middle Initial</label>
              <input
                type="text"
                id="mi"
                name="mi"
                value={formData.mi}
                onChange={handleChange}
                className="w-full rounded-md border bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="suffix">Suffix</label>
              <input
                type="text"
                id="suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                className="w-full rounded-md border bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="college">College</label>
              <select
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full rounded-md border bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option defaultValue={formData.college}>
                  {formData.college}
                </option>
                <option value="CAS">CAS</option>
                <option value="CME">CME</option>
                <option value="COE">COE</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="academicRank"
                className="mb-2 block text-gray-700"
              >
                Academic Rank
              </label>
              <select
                id="academicRank"
                name="academic_rank"
                value={formData.academic_rank}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option defaultValue={formData.academic_rank}>
                  {formData.academic_rank}
                </option>
                {AcademicRanksOptions.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="unit" className="mb-2 block text-gray-700">
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option defaultValue={formData.unit}>{formData.unit}</option>
                {UnitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                className="rounded bg-green-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-green-700"
                type="submit"
              >
                Update
              </Button>
              {
                <Button
                  className="rounded bg-red-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-red-700"
                  onClick={() => history("/manage-faculty")}
                  type="button"
                >
                  Cancel
                </Button>
              }
            </div>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default FacultyDetails;