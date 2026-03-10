import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { type MonitoringFormDetailsType } from "../types/types";
import axios, { AxiosError } from "axios";

const useGetMonitoringForm = (id: string) => {
  return useQuery<MonitoringFormDetailsType, AxiosError>({
    queryKey: ["monitoringForm", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/research-monitoring-form/${id}`);
        return response.data.data as MonitoringFormDetailsType;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error;
        }
        throw new Error("An unexpected error occurred");
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export default useGetMonitoringForm;
