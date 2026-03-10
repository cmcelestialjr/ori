import { useEffect, useState } from "react";
import api from "../components/api/axios";
import { ResearchMonitoringForm } from "../components/admin/types";
import axios from "axios";

const MetricsDashboard = {
  total_count: 0,
  highest_points: {
    id: 0,
    fname: "",
    lname: "",
    mi: "",
    suffix: "",
    total_points: 0,
  },
  total_users: 0,
  total_evaluated: 0,
};

export default function useFetchAdminResearchMonitoringForm() {
  const [approvedResearch, setApprovedResearch] = useState<
    ResearchMonitoringForm[]
  >([]);
  const [metrics, setMetrics] = useState(MetricsDashboard);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchResearchMonitoring = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get("/api/research-monitoring-forms", {
          signal: controller.signal,
        });

        const { data } = response.data;
        setApprovedResearch(data.forms);
        setMetrics({
          highest_points: { ...data.highest_points },
          total_count: data.total_count,
          total_evaluated: data.total_evaluated,
          total_users: data.total_users
        });
        setIsLoading(false);
        setError("");
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else if (err instanceof Error) {
          console.error("Failed to fetch research monitoring forms:", err);
          setError(err.message);
        } else {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchResearchMonitoring();

    return () => controller.abort(); // Ensure the request is canceled on unmount.
  }, []);

  return { metrics, approvedResearch, isLoading, error };
}
