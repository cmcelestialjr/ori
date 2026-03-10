import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { AxiosError } from "axios";

interface AdminUpdateParams {
  points: number;
  rejected_message: string;
}

export interface UpdateMonitoringFormVariables {
  id: number;
  status: string[];
  rejected_message?: string;
  isAdmin?: boolean;
  adminParams?: AdminUpdateParams;
}

const useUpdateMonitoringForm = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    UpdateMonitoringFormVariables
  >(
    async ({ id, status, rejected_message, isAdmin, adminParams }) => {
      if (isAdmin && adminParams) {
        await api.put(`/api/admin/research-monitoring-form/${id}/update`, {
          ...adminParams,
          status: status,
        });
      } else {
        await api.patch(
          `api/research-monitoring-form/${id}/update/coordinator`,
          { status: status, rejected_message: rejected_message },
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["adminSubmissions"]);
        queryClient.invalidateQueries(["facultyDashboard"]);
      },
      onError: (error) => {
        console.error("Error updating monitoring form:", error);
      },
    },
  );
};

export default useUpdateMonitoringForm;
