import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { profileIcon } from "../../../assets/images";
import { useAuthContextProvider } from "../../../hooks/hooks";
import axios from "../../api/axios";
import {
  AcademicRanksOptions,
  CollegeOption,
  UnitOptions,
} from "../../../constant/UserDropOptionsData";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import { User } from "../../shared/types/types";

// --- THE ULTIMATE IMAGE HELPER ---
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return profileIcon;

  try {
    let cleanPath = path.replace(/\\/g, "/");

    if (cleanPath.startsWith("http") && !cleanPath.includes("localhost") && !cleanPath.includes("127.0.0.1")) {
        return cleanPath;
    }

    if (cleanPath.includes("/storage/")) {
        cleanPath = cleanPath.substring(cleanPath.indexOf("/storage/") + 9);
    }

    cleanPath = cleanPath.replace(/^public\//, "").replace(/^\//, "");

    return `/storage/${cleanPath}?t=${new Date().getTime()}`;

  } catch (error) {
    return profileIcon;
  }
};

const initialData = {
  id: 0,
  fname: "",
  lname: "",
  mi: "",
  suffix: "",
  email: "",
  image_path: "",
  password: "",
  academic_rank: "",
  unit: "",
  college: "",
  created_at: null,
  deleted_at: null,
  updated_at: null,
  roles: [{ name: "" }] as [{ name: string }],
};

export default function ProfileSettings() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, setUser } = useAuthContextProvider();

  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);

  const imgInput = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<User>(initialData);

  useEffect(() => {
    if (!user) return;

    try {
      setFormData({
        fname: user.fname || "",
        lname: user.lname || "",
        mi: user.mi || "",
        email: user.email || "",
        image_path: user.image_path || "",
        academic_rank: user.academic_rank || "",
        unit: user.unit || "",
        suffix: user.suffix || "",
        id: user.id || 0,
        college: user.college || "",
        created_at: user.created_at || null,
        deleted_at: user.deleted_at || null,
        updated_at: user.updated_at || null,
        roles: user.roles || [{ id: 1, name: "" }],
      });
    } catch (error) {
      console.error("Error setting form data:", error);
    }
  }, [user]);

  // --- SMART BUTTON LOGIC ---
  // Compares the current form data to the original user data
  const hasChanges = user ? (
    (formData.fname ?? "") !== (user.fname ?? "") ||
    (formData.lname ?? "") !== (user.lname ?? "") ||
    (formData.mi ?? "") !== (user.mi ?? "") ||
    (formData.suffix ?? "") !== (user.suffix ?? "") ||
    (formData.email ?? "") !== (user.email ?? "") ||
    (formData.academic_rank ?? "") !== (user.academic_rank ?? "") ||
    (formData.unit ?? "") !== (user.unit ?? "") ||
    (formData.college ?? "") !== (user.college ?? "") ||
    profilePic !== undefined // True if a new image was selected
  ) : false;
  // --------------------------

  const uploadProfile = async (e: ChangeEvent<HTMLInputElement>) => {
    const imageData = new FormData();
    const { files } = e.target;

    if (files && files[0]) {
        setProfilePic(URL.createObjectURL(files[0]));
        imageData.append("image_path", files[0]);
    } else {
        return;
    }

    try {
      const response = await axios.post("/api/file-upload-public", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imagePath =
        response.data.image_path || response.data?.data?.image_path;

      setFormData({
        ...formData,
        image_path: imagePath,
      });
    } catch (error) {
      console.error("File upload failed: ", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Extra safety: Don't allow submission if nothing changed
    if (!hasChanges) return;

    try {
      // 1. Explicitly select ONLY the fields the backend actually expects.
      const payload: Partial<User> = {
        fname: formData.fname,
        lname: formData.lname,
        mi: formData.mi,
        suffix: formData.suffix,
        email: formData.email,
        academic_rank: formData.academic_rank,
        unit: formData.unit,
        college: formData.college,
        image_path: formData.image_path
      };

      if (payload.image_path) {
        let clean = payload.image_path.replace(/\\/g, "/");
        if (clean.includes("/storage/")) {
            clean = clean.substring(clean.indexOf("/storage/") + 9);
        }
        payload.image_path = clean;
      }

      // We removed the 'delete payload.image_path' block here so the backend
      // always receives the correct path and doesn't try to move a "null" file.

      const response = await axios.put(
        `/api/user/${formData.id}`,
        payload
      );

      const updatedUser = {
        ...user,
        ...response.data.data
      } as User;

      setUser(updatedUser);
      sessionStorage.setItem("User", JSON.stringify(updatedUser));

      setFormData({
        fname: updatedUser.fname || "",
        lname: updatedUser.lname || "",
        mi: updatedUser.mi || "",
        email: updatedUser.email || "",
        image_path: updatedUser.image_path || "",
        academic_rank: updatedUser.academic_rank || "",
        unit: updatedUser.unit || "",
        suffix: updatedUser.suffix || "",
        id: updatedUser.id || 0,
        college: updatedUser.college || "",
        created_at: updatedUser.created_at || null,
        deleted_at: updatedUser.deleted_at || null,
        updated_at: updatedUser.updated_at || null,
        roles: updatedUser.roles || [{ name: "" }],
      });
      setProfilePic(undefined);

      toast.success("Successfully updated.");

      navigate("/admin-settings/profile");

    } catch (error: any) {
      console.error("Profile Update Error:", error);

      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(" ");
        toast.error(`Validation Failed: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile due to a server error.");
      }
    }
  };

  return (
    <section className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-10 rounded-md bg-white p-10 shadow-custom"
      >
        <h1 className="text-2xl font-bold text-gray-700">Profile Details</h1>

        <div className="flex justify-center">
          <div className="relative h-40 w-40 cursor-pointer">
            <div
              onClick={() => imgInput.current?.click()}
              className="over relative h-full w-full overflow-hidden rounded-full border-2 border-gray-400 bg-white"
            >
            <img
              key={profilePic || formData.image_path}
              src={profilePic || getImageUrl(formData.image_path)}
              alt="Profile Picture"
              className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = profileIcon;
              }}
            />
            <input
              type="file"
              accept="image/*"
              ref={imgInput}
              onChange={uploadProfile}
              className="hidden"
            />
          </div>
          <div
            onClick={() => imgInput.current?.click()}
            className="absolute bottom-0 right-0 grid h-10 w-10 translate-x-1 place-content-center rounded-full border border-gray-400 bg-[#e2e5e9]"
          >
            <FaCamera />
          </div>
        </div>
        </div>

        <div>
          <label htmlFor="fname" className="mb-2 block font-bold text-gray-700">First Name</label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          />
        </div>
        <div>
          <label htmlFor="mi" className="mb-2 block font-bold text-gray-700">Middle Initial</label>
          <input
            type="text"
            id="mi"
            name="mi"
            value={formData.mi}
            onChange={handleChange}
            maxLength={1}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          />
        </div>
        <div>
          <label htmlFor="lname" className="mb-2 block font-bold text-gray-700">Last Name</label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          />
        </div>
        <div>
          <label htmlFor="suffix" className="mb-2 block font-bold text-gray-700">Suffix</label>
          <input
            type="text"
            id="suffix"
            name="suffix"
            value={formData.suffix}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          />
        </div>
        <div>
          <label htmlFor="academickRank" className="mb-2 block font-bold text-gray-700">Academic Rank</label>
          <select
            name="academic_rank"
            id="academickRank"
            value={formData.academic_rank}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          >
            <option value="" disabled>Select Academic Rank</option>
            {AcademicRanksOptions.map((rank) => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="unit" className="mb-2 block font-bold text-gray-700">Unit</label>
          <select
            name="unit"
            id="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          >
            <option value="" disabled>Select Unit</option>
            {UnitOptions.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="college" className="mb-2 block font-bold text-gray-700">College</label>
          <select
            name="college"
            id="college"
            value={formData.college}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          >
            <option value="" disabled>Select College</option>
            {CollegeOption.map((college) => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-bold text-gray-700">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          />
        </div>

        <div className="space-x-10">
          <button
            type="submit"
            disabled={!hasChanges}
            className={`rounded-md px-4 py-2 font-semibold transition-all duration-200 ${
              hasChanges
                ? "bg-blue-700 text-white hover:bg-blue-600 shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin-settings/profile")}
            className="rounded-md border-2 border-blue-700 px-3 py-2 font-semibold text-gray-700 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
