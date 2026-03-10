import { useForm } from "react-hook-form";
import api from "../api/axios";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Button from "../shared/components/Button";
import { useToast } from "../../hooks/useToast";

type PasswordCredentials = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

const CoordinatorPassword = ({ userId }: { userId: number }) => {
  const toast = useToast();
  const {
    register,
    watch,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });
  const newPassword = watch("password");
  const currentPassword = watch("current_password");
  const confirmPassword = watch("password_confirmation");

  const hasChanges =
    (currentPassword?.trim()?.length ?? 0) > 0 ||
    (newPassword?.trim()?.length ?? 0) > 0 ||
    (confirmPassword?.trim()?.length ?? 0) > 0;

  const handlePasswordChange = async (password: PasswordCredentials) => {
    try {
      await api.post("/api/password-reset/" + userId, password);
      toast.success("Password updated successfully.");
      reset();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.errors) {
        Object.keys(e.response.data.errors).forEach((field) => {
          setError(field as keyof PasswordCredentials, {
            type: "server",
            message: e.response?.data.errors[field][0],
          });
        });
        const firstError = Object.values(e.response.data.errors).flat()[0];
        toast.error(typeof firstError === "string" ? firstError : "Failed to update password.");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handlePasswordChange)}
      className="w-full px-6 py-6 sm:px-9 sm:py-6 lg:px-5 lg:py-5"
    >
      <h2 className="text-xl font-semibold">Password</h2>
      <p className="mt-2 text-sm text-gray-500">Change your password</p>
      <label
        htmlFor="password"
        className="mt-6 block font-semibold text-gray-900 sm:mt-8 lg:mt-16"
      >
        Current Password
      </label>
      <div>
        <input
          id="password"
          type="password"
          {...register("current_password", {
            required: "This field is required.",
          })}
          placeholder="Your current password"
          className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
        />
        {errors.current_password && (
          <span className="text-sm text-red-500">
            {errors.current_password?.message}
          </span>
        )}
      </div>
      <label
        htmlFor="newPassword"
        className="mt-5 block font-semibold text-gray-900"
      >
        New Password
      </label>
      <div>
        <input
          placeholder="Your new password"
          type="password"
          {...register("password", {
            required: "This field is required.",
            minLength: {
              message: "Must be at least 8 characters.",
              value: 8,
            },
          })}
          id="newPassword"
          className="mt-3 w-full rounded-sm border-b border-gray-400 px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700"
        />
        {errors.password && (
          <span className="block text-sm text-red-500">
            {errors.password?.message}
          </span>
        )}
      </div>
      <label
        htmlFor="confirmPassword"
        className="mt-5 block font-semibold text-gray-900"
      >
        Confirm Password
      </label>
      <div>
        <input
          placeholder="Confirm new password"
          {...register("password_confirmation", {
            required: "This field is required.",
            validate: (val) => val === newPassword || "Password do not match.",
          })}
          type="password"
          id="confirmPassword"
          className={`mt-3 w-full rounded-sm border-b px-3 py-3 text-sm font-semibold text-gray-800 focus:ring-gray-700 ${confirmPassword && newPassword !== confirmPassword ? "border-red-500" : confirmPassword && newPassword === confirmPassword ? "border-green-500" : "border-gray-400"}`}
        />
        {errors.password_confirmation && (
          <span className="block text-sm text-red-500">
            {errors.password_confirmation?.message}
          </span>
        )}
      </div>
      <Button
        type="submit"
        isDisabled={isSubmitting || !hasChanges}
        className={`mt-5 w-full rounded-sm px-2 py-2 text-sm font-semibold transition-all duration-200 ${
          hasChanges && !isSubmitting
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
        }`}
      >
        {isSubmitting ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
};

export default CoordinatorPassword;
