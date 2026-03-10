import { useQuery } from "@tanstack/react-query";
import { type ResearchInvolvementType } from "../../shared/types/types";
import api from "../../api/axios";
import axios from "axios";

const fetchInvolvementTypes = async (): Promise<ResearchInvolvementType[]> => {
  try {
    const response = await api.get("/api/research-involvement-types");
    return response.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.message || "Failed to fetch research involvement types",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

const useGetResearchInvolvementTypes = () => {
  return useQuery({
    queryKey: ["researchInvolvementTypes"],
    queryFn: fetchInvolvementTypes,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 1,
  });
};

export default useGetResearchInvolvementTypes;
