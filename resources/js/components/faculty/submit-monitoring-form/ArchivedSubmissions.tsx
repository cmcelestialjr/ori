import React, { useCallback, useEffect, useRef, useState } from "react";
import { parseDate } from "../../util/parseDate";
import DataTable, { TableColumn } from "react-data-table-component";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import useGetResearchInvolvementTypes from "../../faculty/hooks/useGetResearchInvolvementTypes";
import { useForm } from "react-hook-form";
import { useFacultyArchive } from "../../admin/monitoring-form/hooks/hook";
import { ArchivedResearch } from "../../shared/types/types";

type ParamsProps = {
  research_involvement_type?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  points: number;
};

const defaultParams: ParamsProps = {
  research_involvement_type: "",
  start_date: "",
  end_date: "",
  points: 0,
};

const ArchivedSubmissions = () => {
  const [params, setParams] = useState<ParamsProps>(defaultParams);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [savedFilters, setSavedFilters] = useState<ParamsProps>(defaultParams);
  const filterButtonRef = useRef<HTMLDivElement | null>(null);
  const filterModalRef = useRef<HTMLFormElement | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ParamsProps>({
    defaultValues: defaultParams,
  });

  const { archivedResearch, isLoading } = useFacultyArchive<ParamsProps | null>(
    params,
  );

  const { data: researchInvolvementTypes } = useGetResearchInvolvementTypes();

  const columns: TableColumn<Omit<ArchivedResearch, "users">>[] = [
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
    reset(defaultParams);
    setSavedFilters(defaultParams);
    setParams(defaultParams);
  };

  const closeFilterModal = useCallback(() => {
    setSavedFilters(getValues());
    setOpenDropDown(false);
  }, [getValues]);

  const handleToggleDropdown = () => {
    if (openDropDown) {
      closeFilterModal();
      return;
    }
    setOpenDropDown(true);
  };

  useEffect(() => {
    if (!openDropDown) return;
    reset(savedFilters);
  }, [openDropDown, reset, savedFilters]);

  useEffect(() => {
    if (!openDropDown) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        filterModalRef.current?.contains(target) ||
        filterButtonRef.current?.contains(target)
      ) {
        return;
      }
      closeFilterModal();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [openDropDown, closeFilterModal]);

  return (
    <section className="mx-auto grid max-w-7xl auto-cols-[minmax(0,2fr)] gap-5">
      <h1 className="mb-4 text-2xl font-semibold md:mb-0">
        Archived Evaluated Submission
      </h1>

      <div className="flex items-center justify-end gap-x-5">
        <div className="relative" ref={filterButtonRef}>
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-800 px-2 py-2 text-gray-800"
            onClick={handleToggleDropdown}
          >
            <CiFilter size={23} />
            <p className="whitespace-nowrap">Filter</p>
            <RiArrowDropDownLine size={23} />
          </div>

          <form
            ref={filterModalRef}
            onSubmit={handleSubmit(applyFilters)}
            className={`fixed left-1/2 top-20 z-50 flex max-h-[calc(100vh-6rem)] w-[92vw] max-w-[28rem] -translate-x-1/2 flex-col overflow-hidden rounded-md bg-white shadow-md transition-all duration-200 ease-out sm:top-24 sm:w-[26rem] lg:absolute lg:left-auto lg:right-0 lg:top-full lg:mt-2 lg:max-h-[70vh] lg:w-[28rem] lg:translate-x-0 ${
              openDropDown
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
            role="dialog"
            aria-hidden={!openDropDown}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-semibold text-gray-800">
                Filter options
              </p>
              <button
                type="button"
                onClick={closeFilterModal}
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close filter modal"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
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

              <div className="flex justify-end gap-2 border-t border-gray-200 pt-3">
                <button
                  type="button"
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
            </div>
          </form>
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
          // pointerOnHover
          // highlightOnHover
          // onRowClicked={(row) =>
          //   navigate(`/faculty/research-monitoring-form/${row.id}`)
          // }
          pagination
          paginationPerPage={10}
        />
      </div>
    </section>
  );
};

export default ArchivedSubmissions;
