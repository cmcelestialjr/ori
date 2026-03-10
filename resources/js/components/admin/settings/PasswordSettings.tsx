import { useForm } from "react-hook-form";
import Button from "../../shared/components/Button";
import api from "../../api/axios";
import axios from "axios";
import { useAuthContextProvider } from "../../../hooks/hooks";
import { useToast } from "../../../hooks/useToast";

type PasswordCredentials = {
  current_password: string;
  password: string;
  password_confirmation: string;
};
const PasswordSettings = () => {
  const toast = useToast();
  const id = useAuthContextProvider().user?.id;
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

  const handlePasswordChange = async (data: PasswordCredentials) => {
    try {
      await api.post("/api/password-reset/" + id, data);
      toast.success("Successfully updated.");
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
        toast.error(firstError || "Failed to update password.");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    }
  };
  return (
    <section className="flex justify-center">
      <form
        onSubmit={handleSubmit(handlePasswordChange)}
        className="w-full max-w-xl space-y-10 rounded-md bg-white p-4 sm:p-6 md:p-10 md:pt-0 shadow-custom"
      >
        <h1 className="text-2xl font-bold text-gray-700">Change Password</h1>
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block font-bold text-gray-700"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            {...register("current_password", {
              required: "This field is required.",
            })}
            className="w-full rounded-md border-2 border-gray-400 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          />
        </div>
        {errors.current_password && (
          <span className="text-sm text-red-500">
            {errors.current_password?.message}
          </span>
        )}
        <div>
          <label
            htmlFor="newPassword"
            className="mb-2 block font-bold text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            {...register("password", {
              required: "This field is required.",
              minLength: {
                message: "Must be at least 8 characters.",
                value: 8,
              },
            })}
            className="w-full rounded-md border-2 border-gray-400 px-3 py-2 focus:outline-2 focus:outline-gray-500"
          />
          {errors.password && (
            <span className="block text-sm text-red-500">
              {errors.password?.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block font-bold text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("password_confirmation", {
              required: "This field is required.",
              validate: (val) =>
                val === newPassword || "Password do not match.",
            })}
            className="w-full rounded-md border-2 border-gray-400 px-3 py-2 focus:outline-2 focus:outline-gray-500"
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
          className={`mt-10 w-36 rounded-md px-2 py-3 text-sm font-semibold transition-all duration-200 ${
            hasChanges && !isSubmitting
              ? "bg-blue-700 text-white hover:bg-blue-600 shadow-md"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          }`}
        >
          {isSubmitting ? "Loading.." : "Update Password"}
        </Button>
      </form>
    </section>
  );
};

export default PasswordSettings;
