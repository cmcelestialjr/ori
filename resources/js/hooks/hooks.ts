import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextProvider";
import api from "../components/api/axios";
import { UserAdminType, UserType } from "../components/admin/types";
import { useNavigate } from "react-router-dom";
import { User } from "../components/shared/types/types";
import { toast } from "react-toastify";

export function useAuthContextProvider() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Forgot to add provider");
  }
  return context;
}

const fetchUser = async (): Promise<User> => {
  const { data } = await api.get("/api/user");
  return data;
};

export const useUser = () => {
  return useQuery<User>({
    queryKey: ["auth-user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export function useGetUsers(url: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<
    UserAdminType,
    Error
  >({
    queryKey: ["users", url],
    queryFn: async () => {
      const { data } = await api.get(url);
      return data.data as UserAdminType;
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 1,
  });

  const filterUser = (id: number) => {
    queryClient.setQueryData<UserType[]>(["users", url], (oldData) =>
      oldData ? oldData.filter((user) => user.id !== id) : [],
    );
  };

  return {
    data: data,
    isLoading,
    error: isError ? error.message : null,
    filterUser,
    refetchData: refetch,
  };
}
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/users/${id}`),
    onSuccess: () => {
      // Invalidate users so it's refetched
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["adminDashboard"]);
      toast.success("User deleted successfully");

      // Optional redirect
      navigate("/manage-faculty", { replace: true });
    },
    onError: (error) => {
      console.error("Failed to delete user", error);
    },
  });

  return {
    handleDelete: deleteMutation.mutate,
    isDeleting: deleteMutation.isLoading,
  };
}
