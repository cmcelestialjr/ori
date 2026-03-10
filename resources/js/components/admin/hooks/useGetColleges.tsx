import { useEffect, useState } from "react";
import api from "../../api/axios";
import axios from "axios";

type Colleges = {
  id: number;
  college: string;
}[];

const useGetColleges = () => {
  const [colleges, setColleges] = useState<Colleges | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getColleges = async () => {
      try {
        const response = await api.get("/api/colleges");
        setColleges(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message);
        }
      }
    };
    getColleges();
  }, []);
  return { colleges, error };
};

export default useGetColleges;
