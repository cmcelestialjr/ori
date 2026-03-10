import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import axios from "axios";

interface UseGetEntitiesResult<T> {
  data: T | undefined;
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
  isError: boolean;
  isSuccess: boolean;
}

const useGetEntities = <T,>(
  involvement_type: number,
  file_path: string,
): UseGetEntitiesResult<T> => {
  const { data, error, isLoading, refetch, isError, isSuccess } = useQuery<
    T,
    string
  >(
    ["entities"],
    async () => {
      try {
        const res = await api.post(`/api/extract-details`, {
          involvement_type: involvement_type,
          file_path: file_path,
        });

        if (res.status !== 200) {
          throw new Error("Network Error. Try again.");
        }
        return res.data.data;
      } catch (e) {
        if (axios.isAxiosError(e)) {
          throw e.response?.data.message || "An error occurred";
        }
        throw "An error occurred";
      }
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );

  return {
    data,
    error:
      typeof error === "string" ? error : error ? "An error occurred" : null,
    isLoading,
    refetch,
    isError,
    isSuccess,
  };
};

export default useGetEntities;
