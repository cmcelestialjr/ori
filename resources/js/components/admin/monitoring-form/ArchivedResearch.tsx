import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useArchivedResearch } from "./hooks/hook";
import { parseDate } from "../../util/parseDate";
import DataTable, { TableColumn } from "react-data-table-component";
import { type ArchivedResearch } from "../../shared/types/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import useGetResearchInvolvementTypes from "../../faculty/hooks/useGetResearchInvolvementTypes";
import { useForm } from "react-hook-form";
import useDebounce from "../../shared/hooks/useDebounce";

type ParamsProps = {
  name?: string;
  college?: string;
  research_involvement_type?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  points: number;
};

const defaultParams: ParamsProps = {
  name: "",
  college: "",
  research_involvement_type: "",
  start_date: "",
  end_date: "",
  points: 0,
};

const colleges = ["CAS", "CME", "COE"];

const ArchivedResearch = () => {
  const [params, setParams] = useState<ParamsProps>(defaultParams);
  const [openDropDown, setOpenDropDown] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ParamsProps>({
    defaultValues: defaultParams,
  });

  const { archivedResearch, isLoading } =
    useArchivedResearch<ParamsProps | null>(params);

  const watchName = watch("name");
  const val = useDebounce(watchName, 500);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      name: val,
    }));
  }, [val]);

  const { data: researchInvolvementTypes } = useGetResearchInvolvementTypes();

  const columns: TableColumn<ArchivedResearch>[] = [
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
      name: "Points",
      selector: (row) => row.points.points,
      sortable: true,
    },
  ];

  const applyFilters = (filters: ParamsProps) => {
    setParams({
      ...filters,
      points: isNaN(filters.points) ? 0 : filters.points,
      start_date: filters.start_date
        ? new Date(filters.start_date).toISOString()
        : "",
      end_date: filters.end_date
        ? new Date(filters.end_date).toISOString()
        : "",
    });
    setOpenDropDown(false);
  };

  const clearFilters = () => {
    reset();
    setParams(defaultParams);
  };

  return (
    <section className="grid auto-cols-[minmax(0,2fr)] gap-4">
      <h1 className="mb-4 text-2xl font-semibold md:mb-0">
        Archived Evaluated Submission
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
          data={archivedResearch}
          progressPending={isLoading}
          progressComponent={
            <AiOutlineLoading3Quarters className="my-5 size-10 animate-spin" />
          }
          pagination
          paginationPerPage={10}
        />
      </div>
    </section>
  );
};

export default ArchivedResearch;
