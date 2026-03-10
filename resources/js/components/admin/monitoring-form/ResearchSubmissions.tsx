import { IoSearch } from "react-icons/io5";
import { parseDate } from "../../util/parseDate";
import Badge from "../../shared/components/Badge";
import { ResearchMonitoringForm } from "../types";
import DataTable, { TableColumn } from "react-data-table-component";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useGetResearchInvolvementTypes from "../../faculty/hooks/useGetResearchInvolvementTypes";
import { useResearchSubmission } from "./hooks/hook";
import { useNavigate } from "react-router-dom";

type Filters = {
  name: string;
  college: string;
  research_involvement_type: number;
  start_date: string;
  end_date: string;
  points: number;
  status: string;
};

const filters: Filters = {
  name: "",
  college: "",
  research_involvement_type: 0,
  start_date: "",
  end_date: "",
  points: 0,
  status: "",
};

const colleges = ["CAS", "CME", "COE"];

const status = ["pending", "approved", "evaluated", "rejected"];

export default function ResearchSubmissions() {
  const { data: researchInvolvementTypes } = useGetResearchInvolvementTypes();
  const { submissions, isLoading } = useResearchSubmission();

  const [openDropDown, setOpenDropDown] = useState(false);
  const [filteredData, setFilteredData] = useState<ResearchMonitoringForm[]>(
    [],
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<Filters>({
    defaultValues: filters,
  });

  useEffect(() => {
    if (submissions && submissions.length > 0) {
      setFilteredData(submissions);
    }
  }, [submissions]);

  const watchName = watch("name");

  useEffect(() => {
    setFilteredData(
      submissions.filter((item) =>
        item.users.name.toLowerCase().includes(watchName.toLowerCase()),
      ),
    );
  }, [watchName]);

  const handleRowClicked = (id: number) => {
    navigate(`/research-monitoring/${id}`);
  };

  const applyFilters = (forms: Filters) => {
    const changedValues = Object.keys(dirtyFields).reduce((acc, key) => {
      const typedKey = key as keyof Filters;
      let value = forms[typedKey];

      if (typedKey === "start_date" && forms.start_date) {
        value = new Date(forms.start_date).toISOString();
      } else if (typedKey === "end_date" && forms.end_date) {
        value = new Date(forms.end_date).toISOString();
      } else if (typedKey === "points") {
        value = isNaN(forms.points) ? 0 : forms.points;
      }

      return { ...acc, [typedKey]: value };
    }, {} as Partial<Filters>);

    console.log(changedValues);

    const newFilteredData = submissions.filter((submission) => {
      return Object.entries(changedValues).every(([key, value]) => {
        const filterKey = key as keyof Filters;

        if (value === "" || value === undefined) return true;

        switch (filterKey) {
          case "name":
            return submission.users.name
              .toLowerCase()
              .includes((value as string).toLowerCase());

          case "college":
            return submission.users.college
              ?.toLowerCase()
              .includes((value as string).toLowerCase());

          case "research_involvement_type":
            return submission.researchinvolvement.id === (+value as number);

          case "start_date":
            return new Date(submission.created_at) >= new Date(value as string);

          case "end_date":
            return new Date(submission.created_at) <= new Date(value as string);

          case "points":
            return submission.points.points >= (value as number);

          case "status":
            return submission.status.toLowerCase().includes(value as string);

          default:
            return true;
        }
      });
    });

    setFilteredData(newFilteredData);
  };

  const clearFilters = () => {
    reset();
    setFilteredData(submissions);
  };

  const columns: TableColumn<ResearchMonitoringForm>[] = [
    {
      name: "Name",
      selector: (row) => row.users.name,
      sortable: true,
    },
    {
      name: "College",
      selector: (row) => row.users.college,
      sortable: true,
    },
    {
      name: "Research Involvement Type",
      cell: (row) => (
        <p className="capitalize">
          {row.researchinvolvement.research_involvement_type}
        </p>
      ),
      sortable: true,
    },
    {
      name: "Date Submitted",
      selector: (row) => parseDate(row.created_at) || "",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => <Badge type={row.status} />,
      sortable: true,
    },
    {
      name: "Points",
      selector: (row) => row.points.points,
      sortable: true,
    },
  ];

  return (
    <section className="grid auto-cols-[minmax(0,2fr)] gap-4">
      <h1 className="mb-4 text-2xl font-semibold md:mb-0">
        Faculty Research Involvement Submissions
      </h1>

      <div className="flex items-center justify-end gap-x-5">
        <div className="flex items-center">
          <input
            type="search"
            placeholder={"Search for name"}
            onChange={(e) => {
              setValue("name", e.target.value);
            }}
            className="w-[16rem] rounded-l-md border-2 border-r-0 border-slate-400 p-1 pl-5 text-base focus:outline-none"
          />
          <IoSearch
            size={35.7}
            className="rounded-r-md bg-blue-700 p-[3px] text-white"
          />
        </div>

        <div className="relative">
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-800 px-2 py-1.5 text-gray-800"
            onClick={() => setOpenDropDown(!openDropDown)}
          >
            <CiFilter size={23} />
            <p className="whitespace-nowrap">Filter</p>
            <RiArrowDropDownLine size={23} />
          </div>

          {openDropDown && (
            <form
              onSubmit={handleSubmit(applyFilters)}
              className="fixed right-4 z-50 mt-2 w-[24rem] space-y-3 rounded-md bg-white px-4 py-4 shadow-md"
            >
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  College
                </label>
                <select
                  {...register("college")}
                  className="mt-1 cursor-pointer rounded-md border border-gray-300 px-2 py-1 text-sm capitalize"
                >
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Research Involvement Type
                </label>
                <select
                  {...register("research_involvement_type")}
                  className="mt-1 cursor-pointer rounded-md border border-gray-300 px-2 py-1 text-sm capitalize"
                >
                  {researchInvolvementTypes?.map((type) => (
                    <option
                      key={type.id}
                      className="capitalize"
                      value={type.id}
                    >
                      {type.research_involvement_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Date Submitted:
                </label>

                <label className="mt-2 text-xs font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("start_date")}
                  className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />

                <label className="mt-2 text-xs font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  {...register("end_date", {
                    validate: (value, formValues) => {
                      if (
                        value &&
                        new Date(value) <=
                          (formValues.start_date
                            ? new Date(formValues.start_date)
                            : new Date(0))
                          ? new Date(formValues.start_date ?? 0)
                          : ""
                      ) {
                        return "End date must be after started date";
                      }
                      return true;
                    },
                  })}
                  className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />

                <p className="mt-1 text-xs text-red-500">
                  {errors.end_date?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="mt-1 cursor-pointer rounded-md border border-gray-300 px-2 py-1 text-sm capitalize"
                >
                  {status.map((s) => (
                    <option key={s} className="capitalize" value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Points
                </label>
                <input
                  type="number"
                  {...register("points", { valueAsNumber: true })}
                  className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={clearFilters}
                  className="rounded-md border border-gray-400 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-700 px-3 py-1 text-sm text-white hover:bg-blue-800"
                >
                  Apply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="h-full w-full">
        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={isLoading}
          onRowClicked={(row) => handleRowClicked(row.id)}
          pointerOnHover
          highlightOnHover
          progressComponent={
            <AiOutlineLoading3Quarters className="my-5 size-10 animate-spin" />
          }
          pagination
          paginationPerPage={10}
        />
      </div>
    </section>
  );
}
