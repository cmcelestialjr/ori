import { useEffect, useState } from "react";
import axios from "../components/api/axios";

type Sdg = {
  id: number;
  name: string;
  description: string;
  image_path: string;
};

export default function useSdg() {
  const [sdg, setSdg] = useState<Sdg[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const getSDG = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/sdg-agenda", {
          signal: controller.signal,
        });
        setSdg(data.data.sdg);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    getSDG();
    return () => {
      controller.abort();
    };
  }, []);

  return {
    sdg,
    isLoading,
  };
}
