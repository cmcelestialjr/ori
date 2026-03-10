import { useEffect, useState } from "react";
import { Research } from "../../shared/types/types";
import api from "../../api/axios";
import axios from "axios";

const useGetResearch = (id: number) => {
  const [data, setData] = useState<Research | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/research/${id}`, {
          signal: controller.signal,
        });

        setData(res.data.data);
        setLoading(false);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          <div>{e.response?.data.message}</div>;
        }
        setLoading(false);
      }
    };

    fetch();

    return () => controller.abort();
  }, []);

  return { data, loading };
};

export default useGetResearch;
