import { useEffect, useState } from "react";
import axios from "../components/api/axios";

type Agenda = {
  id: number;
  name: string;
  image_path: string;
};

export default function useAgenda() {
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const getSDG = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/sdg-agenda", {
          signal: controller.signal,
        });
        setAgenda(data.data.agenda);
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
    agenda,
    isLoading,
  };
}
