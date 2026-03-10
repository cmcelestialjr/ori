import { parseDate } from "../util/parseDate";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../shared/components/Badge";
import Button from "../shared/components/Button";
import { useFacultyMonitoringForm } from "../admin/monitoring-form/hooks/hook";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import DataTable, { TableColumn } from "react-data-table-component";
import { ResearchMonitoringForm } from "../admin/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import useGetResearchInvolvementTypes from "./hooks/useGetResearchInvolvementTypes";
import { IoSearch } from "react-icons/io5";

type Filters = {
  research_involvement_type: number;
  start_date: string;
  end_date: string;
  points: number;
  status: string;
};

const filters: Filters = {
  research_involvement_type: 0,
  start_date: "",
  end_date: "",
  points: 0,
  status: "",
};

const status = ["pending", "approved", "evaluated", "rejected"];

const MonitoringForm = () => {
  const { data, isLoading: loading } = useFacultyMonitoringForm();
  const { data: researchInvolvementTypes } = useGetResearchInvolvementTypes();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [savedFilters, setSavedFilters] = useState<Filters>(filters);
  const [filteredData, setFilteredData] = useState<ResearchMonitoringForm[]>(
    [],
  );
  const filterButtonRef = useRef<HTMLDivElement | null>(null);
  const filterModalRef = useRef<HTMLFormElement | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<Filters>({
    defaultValues: filters,
  });

  useEffect(() => {
    if (!data) return;

    setFilteredData(data.forms);
  }, [data]);

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

    const newFilteredData = data?.forms.filter((submission) => {
      return Object.entries(changedValues).every(([key, value]) => {
        const filterKey = key as keyof Filters;

        if (value === "" || value === undefined) return true;

        switch (filterKey) {
          case "research_involvement_type":
            return submission.researchinvolvement.id === (+value as number);

          case "start_date":
            return new Date(submission.created_at) >= new Date(value as string);

          case "end_date":
            return new Date(submission.updated_at) <= new Date(value as string);

          case "points":
            return submission.points.points >= (+value as number);

          case "status":
            return submission.status.toLowerCase().includes(value as string);

          default:
            return true;
        }
      });
    });

    setFilteredData(newFilteredData as ResearchMonitoringForm[]);
    setOpenDropdown(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();

    const newFilterData = data?.forms.filter(
      (item) =>
        item.researchinvolvement.research_involvement_type
          .toLocaleLowerCase()
          .includes(val) ||
        item.points.points === +val ||
        item.status.toLowerCase().includes(val) ||
        item.points.rating.toLowerCase().includes(val),
    );

    setFilteredData(newFilterData as ResearchMonitoringForm[]);
  };

  const clearFilters = () => {
    reset(filters);
    setSavedFilters(filters);
    setFilteredData(data?.forms ? data.forms : []);
  };

  const closeFilterModal = useCallback(() => {
    setSavedFilters(getValues());
    setOpenDropdown(false);
  }, [getValues]);

  const handleToggleDropdown = () => {
    if (openDropdown) {
      closeFilterModal();
      return;
    }
    setOpenDropdown(true);
  };

  useEffect(() => {
    if (!openDropdown) return;

    reset(savedFilters);
  }, [openDropdown, reset, savedFilters]);

  useEffect(() => {
    if (!openDropdown) return;

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
  }, [openDropdown, closeFilterModal]);

  const columns: TableColumn<ResearchMonitoringForm>[] = [
    {
      name: "Research Involvement Type",
      cell: (row) => (
        <p className="capitalize">
          {row.researchinvolvement.research_involvement_type}
        </p>
      ),
    },
    {
      name: "Date Submitted",
      cell: (row) => parseDate(row.created_at),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <>
          <Badge type={row.status} />
        </>
      ),
      sortable: true,
    },
    {
      name: "Points",
      selector: (row) => row.points.points,
      sortable: true,
    },
    {
      name: "Rating",
      cell: (row) => <p className="capitalize">{row.points.rating}</p>,
    },
  ];
  return (
    <>
      <section className="mx-auto grid w-full max-w-none auto-cols-[minmax(0,2fr)] gap-5 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">Research Monitoring Forms</h1>
        <div className="flex flex-col-reverse justify-between gap-5 pt-10 md:flex md:flex-row md:items-center">
          <div className="flex items-center">
            <input
              type="search"
              placeholder="Search for ..."
              onChange={handleSearch}
              className="w-[16rem] rounded-l-md border-2 border-r-0 border-slate-400 p-1 pl-5 text-base focus:outline-none"
            />
            <IoSearch
              size={35.7}
              className="rounded-r-md bg-blue-700 p-[3px] text-white"
            />
          </div>

          <div className="flex items-center justify-start gap-x-5">
            {loading ? (
              <AiOutlineLoading3Quarters className="size-8 animate-spin" />
            ) : (
              <Link to="/create/research-monitoring-form">
                <Button
                  type="button"
                  isDisabled={!data?.enable === true}
                  className="text-md rounded-lg bg-blue-900 px-2 py-2.5 text-center font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-gray-800"
                >
                  {!data?.enable
                    ? "Submission is currently disabled"
                    : "Submit New"}
                </Button>
              </Link>
            )}
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
                  openDropdown
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
                }`}
                role="dialog"
                aria-hidden={!openDropdown}
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
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          pointerOnHover
          highlightOnHover
          onRowClicked={(row) =>
            navigate("/faculty/research-monitoring-form/" + row.id)
          }
          pagination
          progressComponent={
            <AiOutlineLoading3Quarters className="my-5 size-7 animate-spin" />
          }
          progressPending={loading}
        />

        {/* <div className="overflow-x-scroll rounded-md bg-white p-5 shadow-custom">
          <div className="rounded-md border-2 border-gray-100">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="relative w-full bg-gray-50 font-sans text-sm text-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Research Involvement Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date Submitted
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rating
                  </th>
                </tr>
                {loading && (
                  <div className="absolute bottom-0 h-1 w-20 animate-loading rounded-sm bg-blue-500"></div>
                )}
              </thead>
              <tbody>
                {forms.length >= 1 &&
                  forms.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b bg-white hover:bg-gray-100"
                    >
                      <td className="cursor-pointer px-6 py-3 capitalize hover:underline">
                        <Link
                          to={`/faculty/research-monitoring-form/${item.id}`}
                        >
                          {item.researchinvolvement.research_involvement_type}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        {parseDate(item.created_at)}
                      </td>
                      <td className="px-6 py-3">
                        <Badge type={item.status} />
                      </td>
                      <td className="px-6 py-3">{item.points?.points}</td>
                      <td className="px-6 py-3 capitalize">
                        {item.points?.rating}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {forms.length < 1 && (
              <p className="mt-5 pb-5 text-center text-sm text-gray-800">
                You currently have no submission yet...
              </p>
            )}
          </div>
        </div> */}
      </section>
    </>
  );
};

export default MonitoringForm;
