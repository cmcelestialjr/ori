import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

type User = {
  id: number;
  fname: string;
  lname: string;
  mi: string;
  suffix: string;
  academic_rank: string;
  unit: string;
  college: string;
  email: string;
  role: string;
};

const useGetUsers = (url: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(url);
      setUsers(response.data.data);
    } catch (error) {
      setError("Failed to fetch users");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, refetch: fetchUsers };
};

export default useGetUsers;
