import { useRef, useState } from "react";
import { useAuthContextProvider } from "../../hooks/hooks";
import { useToast } from "../../hooks/useToast";
import Button from "../shared/components/Button";
import { FaCamera } from "react-icons/fa";
import { User } from "../shared/types/types";
import api from "../api/axios";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm } from "react-hook-form";
import CoordinatorPassword from "./CoordinatorPassword";

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/150";
  if (path.startsWith("http://localhost/storage")) {
      return path.replace("http://localhost/", "http://localhost:8000/");
  }
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/storage/${path}`;
};

const CoordinatorSettings = () => {
  const toast = useToast();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const { user, setUser } = useAuthContextProvider();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    defaultValues: {
      ...user,
    },
  });

  const userId = watch("id");
  const watchedFname = watch("fname");
  const watchedLname = watch("lname");
  const watchedMi = watch("mi");
  const watchedSuffix = watch("suffix");
  const watchedEmail = watch("email");

  const hasAccountChanges = user
    ? (watchedFname ?? "") !== (user.fname ?? "") ||
      (watchedLname ?? "") !== (user.lname ?? "") ||
      (watchedMi ?? "") !== (user.mi ?? "") ||
      (watchedSuffix ?? "") !== (user.suffix ?? "") ||
      (watchedEmail ?? "") !== (user.email ?? "") ||
      imagePath !== null
    : false;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = ["image/png", "image/jpeg"];

    if (e.target.files && !allowedTypes.includes(e.target.files[0].type)) {
      e.target.value = "";
      toast.error("Invalid file type.");
      return;
    }
    const formImage = new FormData();

    if (e.target.files && e.target.files[0]) {
      formImage.append("image_path", e.target.files[0]);
    }
    try {
      const res = await api.post("/api/file-upload-public", formImage, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImagePath(res.data.data.image_path);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg = e.response?.data?.errors?.image_path?.[0] || e.response?.data?.message;
        toast.error(msg || "Failed to upload image.");
      }
    }
  };
  const handleUpdate = async (val: User) => {
    if (isSubmitting || !hasAccountChanges) return;
    try {
      const response = await api.put(`/api/coordinators/${userId}`, {
        ...val,
        image_path: imagePath ?? user?.image_path,
      });
      const updatedUser = response.data.data;
      setUser(updatedUser);
      sessionStorage.setItem("User", JSON.stringify(updatedUser));
      reset(updatedUser);
      setImagePath(null);
      toast.success("Account updated successfully.");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const res = e.response?.data;
        const msg =
          res?.message ||
          (res?.errors && Object.values(res.errors).flat()[0]);
        toast.error(typeof msg === "string" ? msg : "Failed to update account. Please try again.");
        Object.keys(res?.errors || {}).forEach((field) => {
          setError(field as keyof User, {
            type: "server",
            message: res?.errors?.[field]?.[0] || "Validation error",
          });
        });
      } else {
        toast.error("Failed to update account. Please try again.");
      }
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
                  onClick={() => inputFile.current?.click()}
                  className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-blue-500"
                >
                  <img
                    src={getImageUrl(imagePath || user?.image_path)}
                    alt="Profile"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <input
                    onChange={handleUpload}
                    ref={inputFile}
                    type="file"
                    className="hidden"
                    accept="image/jpeg, image/png"
                  />
                </div>
                <div
                  onClick={() => inputFile.current?.click()}
                  className="absolute -bottom-1 -right-1 z-10 grid h-8 w-8 cursor-pointer place-content-center rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  <FaCamera className="text-white" />
                </div>
              </div>

              <form
                onSubmit={handleSubmit(handleUpdate)}
                className="mt-8 w-full lg:mt-10"
              >
                <label
                  htmlFor="fname"
                  className="block font-semibold text-gray-900"
                >
                  First Name
                </label>
                <div>
                  <input
                    id="fname"
                    {...register("fname", {
                      minLength: {
                        message: "Minimum of 2 characters.",
                        value: 2,
                      },
                      required: "First name is required.",
                    })}
                    className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                  />
                  {errors.fname && (
                    <span className="block text-sm text-red-500">
                      {errors.fname?.message}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="mi"
                  className="mt-5 block font-semibold text-gray-900"

                >
                  Middle Initial
                </label>
                <div>
                  <input
                    maxLength={1}
                    id="mi"
                    {...register("mi", {
                      maxLength: {
                        message: "Enter your middle initial only.",
                        value: 1,
                      },
                    })}
                    className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                  />
                  {errors.mi && (
                    <span className="block text-sm text-red-500">
                      {errors.mi?.message}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="lname"
                  className="mt-5 block font-semibold text-gray-900"
                >
                  Last Name
                </label>
                <div>
                  <input
                    id="lname"
                    {...register("lname", {
                      minLength: {
                        message: "Minimum of 2 characters.",
                        value: 2,
                      },
                      required: "Last name is required.",
                    })}
                    className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                  />
                  {errors.lname && (
                    <span className="block text-sm text-red-500">
                      {errors.lname?.message}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="suffix"
                  className="mt-5 block font-semibold text-gray-900"
                >
                  Suffix
                </label>
                <div>
                  <input
                    id="suffix"
                    {...register("suffix", {
                      minLength: {
                        message: "Minimum of 2 characters.",
                        value: 2,
                      },
                    })}
                    className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                  />
                  {errors.suffix && (
                    <span className="block text-sm text-red-500">
                      {errors.suffix?.message}
                    </span>
                  )}
                </div>

                <label
                  htmlFor="email"
                  className="mt-5 block font-semibold text-gray-900"
                >
                  Email
                </label>
                <div>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      pattern: /^\S+@\S+$/i,
                      required: "Email is required.",
                    })}
                    className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
                  />
                  {errors.email && (
                    <span className="block text-sm text-red-500">
                      {errors.email?.message}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  isDisabled={isSubmitting || !hasAccountChanges}
                  className={`mt-5 w-full rounded-sm px-2 py-2 text-sm font-semibold transition-all duration-200 ${
                    hasAccountChanges && !isSubmitting
                      ? "bg-blue-500 text-white hover:bg-blue-800"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  {isSubmitting ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </form>
          </div>
        </div>

        {/* Password */}
        <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:self-start">
          <CoordinatorPassword userId={userId} />
        </div>
      </div>
    </section>
  );
};

export default CoordinatorSettings;
