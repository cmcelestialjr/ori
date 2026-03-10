import { useContext } from "react";
import { MonitoringFormsContext } from "../../ResearchCoordinator/hooks/MonitoringFormsContextProvider";

export const useMonitoringFormContext = () => {
  const context = useContext(MonitoringFormsContext);

  if (!context) {
    throw new Error("Forgot to add monitoring provider");
  }
  return context;
};
