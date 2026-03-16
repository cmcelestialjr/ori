import { useEffect, useRef, useState } from "react";
import { useAuthContextProvider } from "../../hooks/hooks";
import { useToast } from "../../hooks/useToast";
import Button from "../shared/components/Button";
import { FaCamera } from "react-icons/fa";
import { User } from "../shared/types/types";
import api from "../api/axios";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  roles: [{ id: 1, name: "" }],
};
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/150"; 

  if (path.startsWith("http://localhost/storage")) {
      return path.replace("http://localhost/", "http://localhost:8000/");
  }

  if (path.startsWith("http")) return path; 

  return `http://localhost:8000/storage/${path}`; 
};
const FacultySettings = () => {
  const toast = useToast();
  const [data, setData] = useState<User>(initialData);
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [updateAccountLoading, setUpdateAccountLoading] = useState(false);
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { user, setError, setUser } = useAuthContextProvider();

  const hasAccountChanges = user
    ? (data.fname ?? "") !== (user.fname ?? "") ||
      (data.lname ?? "") !== (user.lname ?? "") ||
      (data.mi ?? "") !== (user.mi ?? "") ||
      (data.suffix ?? "") !== (user.suffix ?? "") ||
      (data.email ?? "") !== (user.email ?? "") ||
      (data.image_path ?? "") !== (user.image_path ?? "")
    : false;

  const currentPwd = (password.currentPassword ?? "").trim();
  const newPwd = (password.newPassword ?? "").trim();
  const confirmPwd = (password.confirmPassword ?? "").trim();
  const allFieldsFilled = currentPwd.length > 0 && newPwd.length > 0 && confirmPwd.length > 0;
  const passwordsMatch = newPwd === confirmPwd;
  const newPasswordValid = newPwd.length >= 8;
  const hasPasswordChanges =
    allFieldsFilled && passwordsMatch && newPasswordValid;

  useEffect(() => {
    if (user) {
      setData({
        fname: user.fname,
        lname: user.lname,
        mi: user.mi,
        email: user.email,
        image_path: user.image_path,
        academic_rank: user.academic_rank,
        unit: user.unit,
        suffix: user.suffix,
        id: user.id,
        college: user.college,
        created_at: user.created_at,
        deleted_at: user.deleted_at,
        updated_at: user.updated_at,
        
        // --- ADD THESE TWO LINES ---
        roles: user.roles || [], // Pass the roles (or empty array if null)
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = ["image/png", "image/jpeg"];

    if (e.target.files && !allowedTypes.includes(e.target.files[0].type)) {
      e.target.value = "";
      return alert("Invalid file type.");
    }
    const formImage = new FormData();

    if (e.target.files && e.target.files[0]) {
      formImage.append("image_path", e.target.files[0]);
    }
    try {
      setUploadLoading(true);
      const res = await api.post("/api/file-upload-public", formImage, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData({ ...data, image_path: res.data.data.image_path });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      }
    } finally {
      setUploadLoading(false);
    }
  };
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updateAccountLoading || !hasAccountChanges) return;
    try {
      setUpdateAccountLoading(true);
      const response = await api.put(`/api/coordinators/${data.id}`, data);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      sessionStorage.setItem("User", JSON.stringify(updatedUser));
      setData({
        fname: updatedUser.fname,
        lname: updatedUser.lname,
        mi: updatedUser.mi,
        email: updatedUser.email,
        image_path: updatedUser.image_path,
        academic_rank: updatedUser.academic_rank,
        unit: updatedUser.unit,
        suffix: updatedUser.suffix,
        id: updatedUser.id,
        college: updatedUser.college,
        created_at: updatedUser.created_at,
        deleted_at: updatedUser.deleted_at,
        updated_at: updatedUser.updated_at,
        roles: updatedUser.roles || [],
      });
      toast.success("Account updated successfully.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message ||
          (error.response?.data?.errors &&
            Object.values(error.response.data.errors).flat()[0]);
        toast.error(typeof msg === "string" ? msg : "Failed to update account. Please try again.");
      } else {
        toast.error("Failed to update account. Please try again.");
      }
    } finally {
      setUpdateAccountLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (updatePasswordLoading || !hasPasswordChanges) return;
    const currentPwdVal = (password.currentPassword ?? "").trim();
    const newPwdVal = (password.newPassword ?? "").trim();
    const confirmPwdVal = (password.confirmPassword ?? "").trim();
    if (currentPwdVal.length === 0 || newPwdVal.length === 0 || confirmPwdVal.length === 0) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPwdVal.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPwdVal !== confirmPwdVal) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      setUpdatePasswordLoading(true);
      await api.post("/api/password-reset/" + data?.id, {
        current_password: currentPwdVal,
        password: newPwdVal,
        password_confirmation: confirmPwdVal,
      });
      toast.success("Password updated successfully.");
      setPassword({
        newPassword: "",
        confirmPassword: "",
        currentPassword: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const res = error.response?.data;
        const msg =
          res?.message ||
          res?.errors?.current_password?.[0] ||
          res?.errors?.password?.[0] ||
          (res?.errors && Object.values(res.errors).flat()[0]);
        toast.error(typeof msg === "string" ? msg : "Failed to update password. Please try again.");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
      setPassword({
        newPassword: "",
        confirmPassword: "",
        currentPassword: "",
      });
    } finally {
      setUpdatePasswordLoading(false);
    }
  };
  return (
    <section>
      <h1 className="text-2xl font-semibold">Profile Settings</h1>
      <div className="mt-10 flex max-w-full flex-col gap-6 pb-10 lg:flex-row lg:items-start lg:justify-between lg:space-x-10 lg:gap-0">
        {/* Account Information */}
        <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="relative flex flex-col items-start justify-center px-6 py-5 sm:px-9 lg:py-5">
            <h2 className="text-xl font-semibold">Account Information</h2>
            <p className="mt-2 text-sm text-gray-500">Edit your profile</p>
            <div className="relative mt-6 inline-block sm:mt-8 lg:mt-10">
              <div
                //onClick={() => inputFile.current?.click()}
                className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-blue-500"
              >
                <img
                  src={getImageUrl(data.image_path)}
                  alt="Profile"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* <input
                  onChange={handleUpload}
                  ref={inputFile}
                  type="file"
                  className="hidden"
                  accept="image/jpeg, image/png"
                /> */}
              </div>
              <div
                //onClick={() => inputFile.current?.click()}
                className="absolute -bottom-1 -right-1 z-10 grid h-8 w-8 cursor-pointer place-content-center rounded-full bg-blue-500 hover:bg-blue-600"
              >
                <FaCamera className="text-white" />
              </div>
            </div>

            <form 
            // onSubmit={handleUpdate} 
            className="mt-8 w-full lg:mt-10">
                <label
                  htmlFor="fname"
                  className="block font-semibold text-gray-900"
                >
                  First Name
                </label>
                <input
                  id="fname"
                  name="fname"
                  value={data.fname}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                />
                <label
                  htmlFor="mi"
                  className="mt-5 block font-semibold text-gray-900"
                >
                  Middle Initial
                </label>
                <input
                  value={data.mi}
                  id="mi"
                  onChange={handleChange}
                  name="mi"
                  className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                />
                <label
                  htmlFor="lname"
                  className="mt-5 block font-semibold text-gray-900"
                >
                  Last Name
                </label>
                <input
                  name="lname"
                  onChange={handleChange}
                  value={data.lname}
                  id="lname"
                  className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                />
                <label
                  htmlFor="suffix"
                  className="mt-5 block font-semibold text-gray-900"
                >
                  Suffix
                </label>
                <input
                  name="suffix"
                  onChange={handleChange}
                  value={data.suffix}
                  id="suffix"
                  className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                />

                <label
                  htmlFor="email"
                  className="mt-5 block font-semibold text-gray-900"
                >
                  Email
                </label>
                <input
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  id="email"
                  type="email"
                  className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                />
                {/* <Button
                  type="submit"
                  isDisabled={updateAccountLoading || !hasAccountChanges}
                  className={`mt-5 w-full rounded-sm px-2 py-2 text-sm font-semibold transition-all duration-200 lg:w-full ${
                    hasAccountChanges && !updateAccountLoading
                      ? "bg-blue-500 text-white hover:bg-blue-800"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  {updateAccountLoading ? (
                    <AiOutlineLoading3Quarters className="mx-auto animate-spin" />
                  ) : (
                    "Update Account"
                  )}
                </Button> */}
              </form>
          </div>
        </div>

        {/* Password - Card on mobile/tablet, plain on desktop */}
        {/* <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:self-start">
          <div className="px-6 py-6 sm:px-9 sm:py-6 lg:px-5 lg:py-5">
            <h2 className="text-xl font-semibold">Password</h2>
            <p className="mt-2 text-sm text-gray-500">Change your password</p>
            <label
              htmlFor="password"
              className="mt-6 block font-semibold text-gray-900 sm:mt-8 lg:mt-16"
            >
              Current Password
            </label>
            <input
              id="password"
              type="password"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              placeholder="Your current password"
              className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
            />
            <label
              htmlFor="newPassword"
              className="mt-5 block font-semibold text-gray-900"
            >
              New Password
            </label>
            <input
              placeholder="Your new password"
              type="password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              id="newPassword"
              className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
            />
            {password.newPassword && password.newPassword.length < 8 && (
              <p className="text-sm text-red-500">
                New password must be at least 8 characters.
              </p>
            )}
            {password.newPassword !== password.confirmPassword &&
              password.confirmPassword && (
                <p className="text-sm text-red-500">
                  Confirm password does not match.
                </p>
              )}
            <label
              htmlFor="confirmPassword"
              className="mt-5 block font-semibold text-gray-900"
            >
              Confirm Password
            </label>
            <input
              placeholder="Confirm new password"
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              type="password"
              id="confirmPassword"
              className={`mt-3 w-full rounded-sm border-b ${password.newPassword !== password.confirmPassword ? "border-red-500" : "border-green-500"} px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700`}
            />
            <Button
              type="button"
              isDisabled={updatePasswordLoading || !hasPasswordChanges}
              onClick={handleSubmit}
              className={`mt-5 w-full rounded-sm px-2 py-2 text-sm font-semibold transition-all duration-200 lg:mt-5 ${
                hasPasswordChanges && !updatePasswordLoading
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              {updatePasswordLoading ? (
                <AiOutlineLoading3Quarters className="mx-auto animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FacultySettings;
