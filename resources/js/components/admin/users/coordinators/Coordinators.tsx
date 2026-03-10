import React, { useMemo, useCallback, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useGetUsers } from "../../../../hooks/hooks";
import CoordinatorTable from "./CoordinatorTable";

interface UserDataTable {
  id: number;
  name: string;
  academic_rank: string;
  unit: string;
  college: string;
  email: string;
  coordinator: boolean;
  totalPoints: number | null;
  rating: string;
}

interface ApiUser {
  id: number;
  fname?: string;
  mi?: string;
  lname?: string;
  suffix?: string;
  academic_rank?: string;
  unit?: string;
  college?: string;
  email?: string;
  coordinator?: boolean;
  totalPoints?: number | null;
  rating?: string;
}

const Coordinators: React.FC = () => {
  const { data, error, isLoading, filterUser } = useGetUsers("api/coordinators");
  const [searchTerm, setSearchTerm] = useState("");

  const transformedData = useMemo<UserDataTable[]>(() => {
    if (!data || !Array.isArray(data.users)) return [];
    
    return data.users.map((user: ApiUser) => {
      const firstName = user.fname || '';
      const middleInitial = user.mi ? `${user.mi}.` : '';
      const lastName = user.lname || '';
      const suffix = user.suffix ? `, ${user.suffix}` : '';

      return {
        id: user.id,
        name: `${firstName} ${middleInitial} ${lastName}${suffix}`.replace(/\s+/g, ' ').trim(),
        academic_rank: user.academic_rank || 'N/A',
        unit: user.unit || 'N/A',
        college: user.college || 'N/A',
        email: user.email || 'N/A',
        coordinator: user.coordinator || false,
        totalPoints: user.totalPoints ?? null,
        rating: user.rating || 'N/A',
      };
    });
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return transformedData;
    
    const term = searchTerm.toLowerCase();
    return transformedData.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.unit.toLowerCase().includes(term) ||
        user.college.toLowerCase().includes(term)
    );
  }, [transformedData, searchTerm]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading coordinators data. Please try again later.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-5 p-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Coordinators Management</h1>
        <hr className="border-t-2 border-slate-700" />
      </header>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-xl font-semibold">List of Coordinators</h2>
        
        <div className="relative flex items-center">
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, unit, or college..."
            className="w-full rounded-l-md border-2 border-r-0 border-slate-400 p-2 pl-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:w-64"
            aria-label="Search coordinators"
          />
          <span className="rounded-r-md bg-blue-700 p-2 text-white">
            <IoSearch size={20} />
          </span>
        </div>
      </div>  
        <CoordinatorTable
          loading={isLoading}
          data={filteredData}
          filter={filterUser}
        />
    </section>
  );
};

export default Coordinators;