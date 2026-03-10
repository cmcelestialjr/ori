import { useQuery } from "@tanstack/react-query";
import api from "../components/api/axios";

export type AcademicYearType = {
  id: number;
  academic_year: string;
  start_date: string;
  end_date: string;
  is_submission_enable: boolean;
};

const fetchAcademicYear = async (): Promise<AcademicYearType | null> => {
  const response = await api.get("/api/academic-years");
  const data = response?.data?.data;

  return data;
};

const useFetchDate = () => {
  const {
    data: academicYear,
    isLoading: loading,
    isError,
    refetch,
  } = useQuery<AcademicYearType | null, Error>({
    queryKey: ["academicYear"],
    queryFn: fetchAcademicYear,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 1,
  });

  return {
    academicYear,
    loading,
    refetch,
    error: isError ? "Failed to fetch academic year." : null,
  };
};

export default useFetchDate;
