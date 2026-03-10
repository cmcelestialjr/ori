import { useForm } from "react-hook-form";
import { useGetUsers } from "../../../hooks/hooks";
import api from "../../api/axios";
import { FPESReportProps } from "./FPES/FPESReport";
import Button from "../../shared/components/Button";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import { useState } from "react";

type FormPropsType = {
  startDate: Date | null;
  endDate: Date | null;
  user: string;
};
const Reports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data } = useGetUsers("api/users");
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm<FormPropsType>({
    defaultValues: {
      startDate: null,
      endDate: null,
      user: "",
    },
  });

  const navigate = useNavigate();
  const facultyName = watch("user");

  const filteredUsers = data?.users.filter((user) =>
    user.name.toLowerCase().includes(facultyName.toLowerCase()),
  );

  const onSubmit = async (form: FormPropsType) => {
    setIsLoading(true);

    const id = data?.users.find((user) =>
      user.name.toLowerCase().includes(form.user?.toLowerCase()),
    )?.id as number;

    const res = await api.get("/api/generate-report/" + id, {
      params: {
        startDate: form.startDate,
        endDate: form.endDate,
      },
    });

    const { data: report } = res.data;

    const fpesData: FPESReportProps["data"] = {
      name: report.name,
      college: report.college,
      startDate: form.startDate?.toString() || "",
      endDate: form.endDate?.toString() || "",
      researchInvolvement: report.researchmonitoringform.map(
        (item: {
          researchinvolvement: { research_involvement_type: string };
          points: { points: number };
        }) => ({
          involvement: item.researchinvolvement.research_involvement_type,
          points: item.points?.points || 0,
        }),
      ),
    };

    navigate("/report-preview", { state: { data: fpesData } });
    setIsLoading(false);
  };

  return (
    <section className="mx-auto grid max-w-7xl auto-cols-[minmax(0,2fr)] gap-5">
      <div className="border-sm mx-auto w-2/3 items-center justify-center bg-white p-5 text-gray-800">
        <h1 className="text-2xl font-bold">Generate FPES Report</h1>

        <form
          className="mt-5 flex w-full flex-col gap-y-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative w-full">
            <label
              htmlFor="name"
              className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            >
              Name of Faculty Member
            </label>

            <input
              {...register("user", {
                required: "Faculty name is required",

                validate: (val) => {
                  const exists = data?.users.some(
                    (user) => user.name.toLowerCase() === val.toLowerCase(),
                  );

                  if (!exists) return "Faculty name does not exists.";
                },
              })}
              placeholder="John Doe"
              onChange={(e) => {
                setValue("user", e.target.value);
                setIsDropdownOpen(true);
              }}
              className="mt-1 block w-full rounded-md border border-gray-800 p-1 outline-none"
            />
            {facultyName && isDropdownOpen && (
              <div className="absolute z-50 mt-2 block max-w-[30rem] cursor-pointer overflow-y-auto rounded-sm bg-white px-2 py-1 outline-none">
                {filteredUsers?.length === 0 ? (
                  <p className="text-sm italic">
                    No results for "{facultyName}"
                  </p>
                ) : (
                  filteredUsers?.map((res) => (
                    <div
                      key={res.id}
                      className="mb-1 flex flex-col items-start justify-center"
                    >
                      <button
                        onClick={() => {
                          setValue("user", res.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {res.name}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            <p className="mt-1 text-sm text-red-500">{errors.user?.message}</p>
          </div>
          <div className="flex w-full gap-x-5">
            <div className="w-full flex-col">
              <label htmlFor="start">
                <span className="font-semibold after:ms-1 after:text-red-500 after:content-['*']">
                  Start Date
                </span>
                <input
                  type="date"
                  id="start"
                  className="mt-1 block w-full cursor-pointer rounded-md border border-gray-800 p-1 outline-none"
                  {...register("startDate", {
                    valueAsDate: true,
                    required: "Start date is required",
                    validate: (value, formValues) => {
                      if (
                        formValues.endDate &&
                        value &&
                        new Date(value) >= formValues.endDate
                      ) {
                        return "Start date must be before ending date";
                      }
                      return true;
                    },
                  })}
                />
              </label>
              <p className="mt-1 text-sm text-red-500">
                {errors.startDate?.message}
              </p>
            </div>
            <div className="w-full">
              <label htmlFor="end">
                <span className="font-semibold after:ms-1 after:text-red-500 after:content-['*']">
                  End Date
                </span>
                <input
                  type="date"
                  id="end"
                  className="mt-1 block w-full cursor-pointer rounded-md border border-gray-800 p-1 outline-none"
                  {...register("endDate", {
                    valueAsDate: true,
                    required: "End date is required",
                    validate: (value, formValues) => {
                      if (
                        formValues.startDate &&
                        value &&
                        new Date(value) <= formValues.startDate
                      ) {
                        return "End date must be after starting date";
                      }
                      return true;
                    },
                  })}
                />
              </label>
              <p className="mt-1 text-sm text-red-500">
                {errors.endDate?.message}
              </p>
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button
              type="submit"
              className="rounded-md bg-blue-500 p-3 text-white"
            >
              Generate
            </Button>
          </div>
        </form>
      </div>
      <LoadingSpinner text="Generating report..." isLoading={isLoading} />
    </section>
  );
};

export default Reports;
