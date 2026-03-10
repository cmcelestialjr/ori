import { ReactNode, useEffect, useState } from "react";
import { useGetUsers } from "../../../../hooks/hooks";
import { Link } from "react-router-dom";
import { TiUserAddOutline } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import FacultyTable from "./FacultyTable";
import Card from "../../../sidebar/Card";
import { UserDataTable } from "../../types";
import { LiaFileExportSolid } from "react-icons/lia";
import { CSVLink } from "react-csv";

interface DashboardCard {
  title: string;
  total?: number;
  border: string;
  icon?: ReactNode;
}

const FILTER_OPTIONS = {
  unit: [
    "BSED-PROFED",
    "BSED-FILIPINO",
    "BSED-ENGLISH",
    "BSED-MATH",
    "BSED-VALUES EDUCATION",
    "BSED-SOCIAL STUDIES",
    "BSED-SCIENCE",
    "BEED/BECED/BSNED",
    "BPED",
    "BTLED",
    "ILS",
    "BAPOS/SOCIAL SCIENCE",
    "BACOMM",
    "SOCIAL WORK",
    "IT",
    "BLIS",
    "BSBIO/SCIENCE",
    "BAEL/LANG&LIT",
    "BMME/MAPEH & HUMANITY",
    "HM/TM",
    "ENTREP",
  ],
  academic_rank: [
    "UNIVERSITY PROFESSOR",
    "PROFESSOR VI",
    "PROFESSOR V",
    "PROFESSOR IV",
    "PROFESSOR III",
    "PROFESSOR II",
    "PROFESSOR I",
    "ASSOCIATE PROFESSOR V",
    "ASSOCIATE PROFESSOR IV",
    "ASSOCIATE PROFESSOR III",
    "ASSOCIATE PROFESSOR II",
    "ASSOCIATE PROFESSOR I",
    "ASSISTANT PROFESSOR VI",
    "ASSISTANT PROFESSOR V",
    "ASSISTANT PROFESSOR IV",
    "ASSISTANT PROFESSOR III",
    "ASSISTANT PROFESSOR II",
    "ASSISTANT PROFESSOR I",
    "INSTRUCTOR III",
    "INSTRUCTOR II",
    "INSTRUCTOR I",
  ],

  college: ["CAS", "COE", "CME"],

  applied_category: ["Applied Science", "Humanities"],
};

type Filters = {
  unit: string[];
  academic_rank: string[];
  college: string[];
  applied_category: string[];
};

const Faculties = () => {
  const { data, isLoading, filterUser, refetchData } = useGetUsers("api/users");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [filteredData, setFilteredData] = useState<UserDataTable[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    unit: [],
    academic_rank: [],
    college: [],
    applied_category: [],
  });

  const exportData = filteredData.map((item) => ({
    name: item.name,
    college: item.college,
    unit: item.unit,
    academic_rank: item.academic_rank,
    email: item.email,
    points: item.totalPoints,
    rating: item.rating,
  }));

  useEffect(() => {
    if (!data?.users) return;

    const result = data.users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.rating.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(user.totalPoints).includes(searchQuery);

      const matchAppliedCategory =
        filters.applied_category.length === 0 || user.college !== "CAS"
          ? true
          : filters.applied_category.some((category) => {
              const appliedScienceUnits = [
                "BSIT",
                "BLIS",
                "BSBIO/SCIENCE",
                "BMME/MAPEH & HUMANITY",
              ];
              const humanitiesUnits = [
                "BACOMM",
                "BAPOS/SOCIAL SCIENCE",
                "BAEL/LANG&LIT",
                "SOCIAL WORK",
              ];

              if (category === "Applied Science") {
                return appliedScienceUnits.includes(user.unit);
              } else if (category === "Humanities") {
                return humanitiesUnits.includes(user.unit);
              }
              return false;
            });

      const matchFilters = Object.entries(filters).every(([key, values]) => {
        if (key === "applied_category") return true; // handled separately
        if (values.length === 0) return true;
        return values.includes(user[key as keyof UserDataTable] as string);
      });

      return matchSearch && matchFilters && matchAppliedCategory;
    });

    setFilteredData(result);
  }, [data, searchQuery, filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters((prev) => {
      const isSelected = prev[category].includes(value);
      const updatedCategory = isSelected
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];

      if (category === "college" && value === "CAS" && isSelected) {
        return {
          ...prev,
          [category]: updatedCategory,
          applied_category: [],
        };
      }

      return {
        ...prev,
        [category]: updatedCategory,
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      unit: [],
      academic_rank: [],
      college: [],
      applied_category: [],
    });
  };

  const facultyCards: DashboardCard[] = [
    {
      title: "College of Arts and Sciences",
      total: data?.total_cas,
      border: "border-indigo-900",
    },
    {
      title: "College of Education",
      total: data?.total_coe,
      border: "border-yellow-400",
    },
    {
      title: "College of Management and Entrepreneurship",
      total: data?.total_cme,
      border: "border-indigo-700",
    },
  ];

  const SubHeaderComponent = () => (
    <div>
      <div className="w-full justify-between md:flex">
        {/* Search Bar */}
        <div className="flex items-center">
          <input
            type="search"
            onChange={handleSearch}
            placeholder="Search for..."
            className="w-full rounded-l-md border-2 border-r-0 border-slate-400 p-[6px] pl-5 text-base focus:outline-none md:w-[16rem]"
          />
          <IoSearch size={40} className="rounded-r-md bg-blue-700 text-white" />
        </div>
        {/* Filter Toggle and Add Button */}
        <div className="relative mt-4 flex gap-x-2 md:mt-0">
          <Link
            className="rounded-md bg-blue-700 font-semibold text-white hover:bg-blue-600"
            to="/add-faculty"
          >
            <div className="grid grid-cols-[auto,1fr] items-center gap-2 px-4 py-2">
              <TiUserAddOutline size={23} />
              <p className="whitespace-nowrap">Add Faculty</p>
            </div>
          </Link>
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-800 px-4 text-gray-800"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <CiFilter size={23} />
            <p className="whitespace-nowrap">Filter</p>
            <RiArrowDropDownLine size={23} />
          </div>

          <CSVLink data={exportData} filename="faculty-summary-details">
            <div className="flex h-10 cursor-pointer items-center justify-between rounded-lg bg-green-500 px-2 text-white">
              <LiaFileExportSolid size={23} />
              <p className="whitespace-nowrap">Export</p>
            </div>
          </CSVLink>
          {/* 3-column Filter Panel */}
          {openDropdown && (
            <div className="absolute top-12 z-50 grid max-h-[50vh] grid-cols-1 gap-4 overflow-y-auto rounded-md border border-gray-800 bg-white p-4 shadow-md md:grid-cols-4 lg:right-0 lg:min-w-[50rem]">
              {Object.entries(FILTER_OPTIONS).map(([category, values]) => {
                if (category === "applied_category") return null; // We'll render it conditionally later

                const currentFilters = filters[category as keyof Filters] || [];
                const allSelected = values.length === currentFilters.length;

                const toggleSelectAll = () => {
                  setFilters((prev) => ({
                    ...prev,
                    [category]: allSelected ? [] : [...values],
                  }));
                };

                return (
                  <div key={category}>
                    <h4 className="mb-2 font-semibold capitalize">
                      {category.replace("_", " ")}
                    </h4>

                    {/* Select All */}
                    <div className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        id={`${category}-select-all`}
                        checked={allSelected}
                        className="cursor-pointer accent-blue-500"
                        onChange={toggleSelectAll}
                      />
                      <label
                        htmlFor={`${category}-select-all`}
                        className="cursor-pointer text-sm font-medium"
                      >
                        Select All
                      </label>
                    </div>

                    {values.map((val) => (
                      <div
                        key={val}
                        className="flex items-center space-x-2 py-1"
                      >
                        <input
                          type="checkbox"
                          id={`${category}-${val}`}
                          className="cursor-pointer accent-blue-500"
                          checked={currentFilters.includes(val)}
                          onChange={() =>
                            toggleFilter(category as keyof Filters, val)
                          }
                        />
                        <label
                          htmlFor={`${category}-${val}`}
                          className="line-clamp-1 cursor-pointer text-ellipsis text-sm"
                        >
                          {val}
                        </label>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* 👇 Conditionally render applied_category if CAS is selected */}
              {filters.college.includes("CAS") && (
                <div key="applied_category">
                  <h4 className="mb-2 font-semibold">Applied Category</h4>

                  {/* Select All */}
                  <div className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      id="applied_category-select-all"
                      checked={
                        FILTER_OPTIONS.applied_category.length ===
                        filters.applied_category?.length
                      }
                      className="cursor-pointer accent-blue-500"
                      onChange={() => {
                        const allSelected =
                          FILTER_OPTIONS.applied_category.length ===
                          filters.applied_category?.length;
                        setFilters((prev) => ({
                          ...prev,
                          applied_category: allSelected
                            ? []
                            : [...FILTER_OPTIONS.applied_category],
                        }));
                      }}
                    />
                    <label
                      htmlFor="applied_category-select-all"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Select All
                    </label>
                  </div>

                  {FILTER_OPTIONS.applied_category.map((val) => (
                    <div key={val} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        id={`applied_category-${val}`}
                        className="cursor-pointer accent-blue-500"
                        checked={filters.applied_category?.includes(val)}
                        onChange={() => toggleFilter("applied_category", val)}
                      />
                      <label
                        htmlFor={`applied_category-${val}`}
                        className="line-clamp-1 cursor-pointer text-ellipsis text-sm"
                      >
                        {val}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {(filters.unit.length ||
        filters.academic_rank.length ||
        filters.college.length) > 0 && (
        <div className="my-3 flex justify-end">
          <button
            className="text-sm text-red-600 underline"
            onClick={clearAllFilters}
          >
            Clear all
          </button>
        </div>
      )}
      <div className="scrollbar-hide mt-2 flex items-center gap-4 overflow-x-auto whitespace-nowrap text-sm md:mt-0">
        {Object.values(filters)
          .flat()
          .map((tag, index) => (
            <span
              key={index}
              className="mr-2 inline-block rounded-md bg-blue-200 px-2 py-1 text-sm text-blue-800"
            >
              {tag}
            </span>
          ))}
      </div>
    </div>
  );

  return (
    <section className="mx-auto grid max-w-7xl auto-cols-[minmax(0,2fr)] gap-5">
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold">Faculty Management</h1>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facultyCards.map((card) => (
            <Card
              key={card.title}
              title={card.title}
              total={card.total}
              borderColor={card.border}
            />
          ))}
        </div>
      </div>

      <hr className="border-t-2 border-slate-700" />
      {SubHeaderComponent()}

      <FacultyTable
        refetch={refetchData}
        loading={isLoading}
        data={filteredData}
        filter={filterUser}
      />
    </section>
  );
};

export default Faculties;
