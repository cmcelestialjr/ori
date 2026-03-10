import { AgendaMapping, SDGMapping } from "../../shared/types/types";
import api from "../../api/axios";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export type SdgAgendaType = {
  sdg: SDGMapping[];
  agenda: AgendaMapping[];
};

const fetchSdgAgenda = async (): Promise<SdgAgendaType> => {
  try {
    const response = await api.get("/api/sdg-agenda");
    return response.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message || "Failed to fetch sdg and agenda");
    }
    throw new Error("An unexpected error occurred");
  }
};

const useGetSdgAgenda = () => {
  return useQuery({
    queryKey: ["sdg-agenda"],
    queryFn: fetchSdgAgenda,
    staleTime: 6 * 60 * 60 * 1000,
    cacheTime: 12 * 60 * 60 * 1000,
    retry: 1,
  });
};

export default useGetSdgAgenda;
