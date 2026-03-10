import { UseFormRegister } from "react-hook-form";
import { FormData } from "./CreateResearchMonitoringForm";

type ResearchDetailsProps = {
  register: UseFormRegister<FormData>;
};

const ResearchDetails = ({ register }: ResearchDetailsProps) => {
  return (
    <div>
      <input />
    </div>
  );
};

export default ResearchDetails;
