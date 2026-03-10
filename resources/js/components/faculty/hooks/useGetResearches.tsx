import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Research } from "../../shared/types/types";
import axios from "axios";
import { PaginationTableType } from "../../admin/types";

type ResearchDataType = {
  data: Research[];
  paginationData: PaginationTableType;
};

const useGetResearches = () => {
  const [data, setData] = useState<ResearchDataType>({
    data: [],
    paginationData: {
      current_page: 1,
      last_page: 1,
      links: [{ active: true, label: "", url: "" }],
      total: 1,
    },
  });
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ search: "", page: 1 });

  useEffect(() => {
    const controller = new AbortController();

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/research", {
          params: { ...params },
          signal: controller.signal,
        });

        setData({
          data: res.data.data.data,
          paginationData: { ...res.data.data },
        });
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
  }, [params]);
  return { data, loading, setParams };
};

export default useGetResearches;
