import { useEffect, useState } from "react";
import { AcademicRanksOptions } from "../../../../constant/UserDropOptionsData";
import useAddUsers from "../../../../hooks/useAddUsers";
import useGetColleges from "../../hooks/useGetColleges";
import api from "../../../api/axios";
import { useForm } from "react-hook-form";
import { User } from "../../../shared/types/types";

type UnitType = {
  id: number;
  unit: string;
}[];

export type UseFormType = User & { password: string };

function Adduser() {
  const [units, setUnits] = useState<UnitType | null>(null);

  const { colleges } = useGetColleges();

  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UseFormType>({
    defaultValues: {
      fname: "",
      lname: "",
      mi: "",
      college: "",
      unit: "",
      image_path: undefined,
      academic_rank: "",
      suffix: "",
      email: "",
      password: "",
    },
  });

  const { fileUpload, onSubmit, loading } = useAddUsers(
    "/api/users",
    "/manage-faculty",
    setError,
  );

  const college = watch("college");

  useEffect(() => {
    // Only fetch if a valid college is actually selected (not an empty string)
    if (college) {
      const getUnits = async () => {
        try {
          // FIX 1: Added explicit .get() and absolute path with leading slash '/'
          const response = await api.get("/api/units", {
            params: {
              college: college,
            },
          });

          // Fallback check: sometimes Laravel returns response.data, sometimes response.data.data
          const fetchedUnits = response.data.data || response.data || [];
          setUnits(fetchedUnits);
        } catch (error) {
          console.error("Error fetching units", error);
        }
      };
      getUnits();
    } else {
      // Clear units if they switch back to the empty placeholder
      setUnits(null);
    }
  }, [college]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-[70%] rounded-lg bg-white p-10 shadow-custom"
      >
        <h1 className="mb-10 font-bold">Add new faculty member</h1>

        <div className="flex w-full flex-1 justify-between">
          <div className="w-[45%]">
            <label
              htmlFor="firstName"
              className="mb-2 block font-bold text-gray-700"
            >
              First Name
            </label>
            <input
              {...register("fname", {
                minLength: { message: "Minimum of 2 characters", value: 2 },
                maxLength: 20,
                required: "This field is required.",
              })}
              aria-invalid={errors.fname ? "true" : "false"}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fname?.message && (
              <span role="alert" className="p-2 text-sm text-red-700">
                {errors.fname?.message}
              </span>
            )}
          </div>

          <div className="w-[45%]">
            <label
              htmlFor="lastName"
              className="mb-2 block font-bold text-gray-700"
            >
              Last Name
            </label>
            <input
              {...register("lname", {
                minLength: { message: "Minimum of 2 characters.", value: 2 },
                maxLength: 20,
                required: "This field is required.",
              })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lname?.message && (
              <span className="p-2 text-sm text-red-700">
                {errors.lname?.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="mt-4">
            <label
              htmlFor="middleInitial"
              className="mb-2 block font-bold text-gray-700"
            >
              Middle Initial
            </label>
            <input
            maxLength={1}
              {...register("mi", {
                maxLength: {
                  message: "Enter your middle initial only.",
                  value: 1,
                },
              })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.mi?.message && (
              <span className="p-2 text-sm text-red-700">
                {errors.mi?.message}
              </span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="suffix"
              className="mb-2 block font-bold text-gray-700"
            >
              Suffix
            </label>
            <input
              {...register("suffix", { max: 30 })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="image"
              className="mb-2 block font-bold text-gray-700"
            >
              Image Profile
            </label>
            <input
              type="file"
              id="image"
              name="image_path"
              onChange={fileUpload}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="department"
            className="mb-2 block font-bold text-gray-700"
          >
            Department
          </label>
          <select
            {...register("college", { required: "This field is required." })}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* FIX 2: Set an empty string value to prevent fake backend requests */}
            <option value="" disabled>
              Select College Department
            </option>
            {colleges?.map((college) => (
              <option key={college.id} value={college.college}>
                {college.college}
              </option>
            ))}
          </select>
          {errors.college?.message && (
            <span className="p-2 text-sm text-red-700">
              {errors.college?.message}
            </span>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="unit" className="mb-2 block font-bold text-gray-700">
            Unit
          </label>
          <select
            {...register("unit", { required: "This field is required." })}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!college || units?.length === 0} // Optional visual safety feature
          >
            {/* FIX 2: Added value="" disabled */}
            <option value="" disabled>Select a unit</option>
            {units?.map((unit) => (
              <option key={unit.id} value={unit.unit}>
                {unit.unit}
              </option>
            ))}
          </select>
          {errors.unit?.message && (
            <span className="p-2 text-sm text-red-700">
              {errors.unit?.message}
            </span>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="academicRank"
            className="mb-2 block font-bold text-gray-700"
          >
            Academic Rank
          </label>
          <select
            {...register("academic_rank", {
              required: "This field is required.",
            })}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* FIX 2: Added value="" disabled */}
            <option value="" disabled>
              Select an academic rank
            </option>
            {AcademicRanksOptions.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>

          {errors.academic_rank?.message && (
            <span className="p-2 text-sm text-red-700">
              {errors.academic_rank?.message}
            </span>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="mb-2 block font-bold text-gray-700">
            Email
          </label>
          <input
            {...register("email", {
              required: "This field is required.",
              pattern: /^\S+@\S+$/i,
            })}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.email?.message && (
            <span role="alert" className="p-2 text-sm text-red-700">
              {errors.email.type === "pattern"
                ? "Invalid email"
                : errors.email.message}
            </span>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="password"
            className="mb-2 block font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              minLength: {
                message: "Minimum password is 8 characters.",
                value: 8,
              },
              required: "This field is required.",
            })}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.password?.message && (
            <span className="p-2 text-sm text-red-700">
              {errors.password?.message}
            </span>
          )}
        </div>
        <div className="mt-6">
          {!loading ? (
            <button
              type="submit"
              className="w-full rounded-md bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-600"
            >
              Register
            </button>
          ) : (
            <button
              type="submit"
              disabled
              className="align-items-center w-full rounded-md bg-blue-500 px-4 py-2 font-bold text-white cursor-not-allowed"
            >
              Registering...
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Adduser;
