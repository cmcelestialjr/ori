import { useEffect, useState, useRef } from "react";
import { AcademicRanksOptions } from "../constant/UserDropOptionsData";
import api from "../components/api/axios";
import { useForm } from "react-hook-form";
import { User } from "../components/shared/types/types";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const profileIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2NjYyIgZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00czEuNzktNCA0LTRzLTQuNzktNC00LTQgNCAxLjc5IDQgNHMtMS43OSA0LTQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyYTEgMSAwIDAgMCAxIDFoMTRhMSAxIDAgMCAwIDEtMXYtMmMwLTIuNjYtNS4zMy00LTgtNHoiLz48L3N2Zz4=";

type CollegeType = { id: number; college: string };
type UnitType = {
  id: number;
  unit: string;
}[];

export type RegisterFormType = User & { password: string; otp?: string };

export default function Register() {
  const [colleges, setColleges] = useState<CollegeType[] | null>(null);
  const [units, setUnits] = useState<UnitType | null>(null);
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const imgInput = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // Fetch colleges from public endpoint (no auth required)
  useEffect(() => {
    const getColleges = async () => {
      try {
        const response = await api.get("/api/public/colleges");
        setColleges(response.data.data || response.data || []);
      } catch (error) {
        console.error("Error fetching colleges", error);
      }
    };
    getColleges();
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const {
    register,
    setError,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormType>({
    defaultValues: {
      fname: "", lname: "", mi: "", college: "", unit: "",
      academic_rank: "", suffix: "", email: "", password: "", image_path: "",
    },
  });

  const college = watch("college");

  useEffect(() => {
    if (college) {
      const getUnits = async () => {
        try {
          const response = await api.get("/api/public/units", {
            params: { college: college },
          });

          const fetchedUnits = response.data.data || response.data || [];
          setUnits(fetchedUnits);
        } catch (error) {
          console.error("Error fetching units", error);
        }
      };
      getUnits();
    } else {
      setUnits(null);
    }
  }, [college]);

  const uploadProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || !files[0]) return;

    setProfilePic(URL.createObjectURL(files[0]));

    const formImage = new FormData();
    formImage.append("image_path", files[0]);
    try {
      const res = await api.post("/api/public/file-upload-public", formImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imagePath = res.data.data?.image_path || res.data?.image_path;
      setValue("image_path", imagePath);
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async () => {
    const email = getValues("email");
    if (!email) {
      setError("email", { type: "manual", message: "Email is required." });
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    try {
      await api.post("/api/send-otp", { email });
      setStep("otp");
      setCountdown(60); // 60 second cooldown before resend
      toast.success("OTP sent to your email!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors?.email) {
        setError("email", {
          type: "manual",
          message: error.response.data.errors.email[0],
        });
      } else if (axios.isAxiosError(error) && error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError("Failed to send OTP. Please try again.");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 1 form submit: validate form then send OTP
  const onFormSubmit = () => {
    handleSendOtp();
  };

  // Step 2: Verify OTP and register
  const handleVerifyAndRegister = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }

    setRegisterLoading(true);
    setOtpError("");
    try {
      const formData = getValues();
      await api.post("/api/register", {
        ...formData,
        otp: otp,
      });
      toast.success("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const errs = error.response.data.errors;
        Object.entries(errs).forEach(([key, messages]) => {
          if (key === "otp") {
            setOtpError(Array.isArray(messages) ? messages[0] : messages as string);
          } else {
            setError(key as keyof RegisterFormType, {
              type: "manual",
              message: Array.isArray(messages) ? messages[0] : messages as string,
            });
          }
        });
      } else {
        setOtpError("Registration failed. Please try again.");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center py-10 bg-gray-50">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="w-full max-w-[50rem] rounded-md bg-white p-10 shadow-lg"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Faculty Registration</h1>
          <p className="mt-2 text-gray-500">
            {step === "form"
              ? "Create your account to access the portal"
              : "Enter the OTP sent to your email"}
          </p>
        </div>

        {step === "form" ? (
          <>
            <div className="mb-8 flex justify-center">
              <div className="relative h-24 w-24 cursor-pointer">
                <div
                  onClick={() => imgInput.current?.click()}
                  className="relative h-full w-full overflow-hidden rounded-full border-2 border-blue-500 bg-white"
                >
                  <img
                    src={profilePic || profileIcon}
                    alt="Profile"
                    className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={imgInput}
                    onChange={uploadProfile}
                    className="hidden"
                  />
                </div>
                <div className="mt-2 text-center text-xs font-semibold text-gray-500">Upload Photo</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">First Name</label>
                <input
                  {...register("fname", { required: "First name is required." })}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fname && <p className="mt-1 text-xs text-red-600">{errors.fname.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Last Name</label>
                <input
                  {...register("lname", { required: "Last name is required." })}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.lname && <p className="mt-1 text-xs text-red-600">{errors.lname.message}</p>}
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-bold text-gray-700">M.I.</label>
                  <input
                    {...register("mi", { maxLength: 1 })}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-bold text-gray-700">Suffix</label>
                  <input
                    {...register("suffix")}
                    placeholder="e.g. Jr, Sr"
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Department</label>
                <select
                  {...register("college", { required: "College is required." })}
                  className="w-full rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select College Department</option>
                  {colleges?.map((col: any) => (
                    <option key={col.id} value={col.college}>{col.college}</option>
                  ))}
                </select>
                {errors.college && <p className="mt-1 text-xs text-red-600">{errors.college.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Unit</label>
                <select
                  {...register("unit", { required: "Unit is required." })}
                  disabled={!college || units?.length === 0}
                  className="w-full rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="" disabled>Select a unit</option>
                  {units?.map((u: any) => (
                    <option key={u.id} value={u.unit}>{u.unit}</option>
                  ))}
                </select>
                {errors.unit && <p className="mt-1 text-xs text-red-600">{errors.unit.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Academic Rank</label>
                <select
                  {...register("academic_rank", { required: "Rank is required." })}
                  className="w-full rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select an academic rank</option>
                  {AcademicRanksOptions.map((rank: string) => (
                    <option key={rank} value={rank}>{rank}</option>
                  ))}
                </select>
                {errors.academic_rank && <p className="mt-1 text-xs text-red-600">{errors.academic_rank.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required.", pattern: /^\S+@\S+$/i })}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Password</label>
                <input
                  type="password"
                  {...register("password", { required: "Password is required.", minLength: { value: 8, message: "Min 8 characters." } })}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                disabled={otpLoading}
                className={`w-full rounded-md px-4 py-2 font-semibold text-white transition-colors ${otpLoading ? "cursor-not-allowed bg-blue-400" : "bg-blue-700 hover:bg-blue-600 shadow-md"
                  }`}
              >
                {otpLoading ? "Sending OTP..." : "Register"}
              </button>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-blue-700 hover:underline">
                  Log in here
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* Step 2: OTP Verification */
          <div className="mx-auto max-w-sm">
            <div className="mb-6 rounded-md bg-blue-50 p-4 text-center text-sm text-blue-700">
              We've sent a 6-digit verification code to{" "}
              <span className="font-bold">{getValues("email")}</span>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-center text-sm font-bold text-gray-700">
                Enter OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setOtpError("");
                }}
                placeholder="000000"
                className="w-full rounded-md border px-3 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {otpError && (
                <p className="mt-2 text-center text-xs text-red-600">{otpError}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerifyAndRegister}
              disabled={registerLoading || otp.length !== 6}
              className={`w-full rounded-md px-4 py-2 font-semibold text-white transition-colors ${registerLoading || otp.length !== 6
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-700 hover:bg-blue-600 shadow-md"
                }`}
            >
              {registerLoading ? "Verifying..." : "Verify & Register"}
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setOtpError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to form
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={countdown > 0 || otpLoading}
                className={`font-semibold ${countdown > 0 || otpLoading
                  ? "cursor-not-allowed text-gray-400"
                  : "text-blue-700 hover:underline"
                  }`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
