import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const totalSubmission = payload[0].payload.total_submission;

    return (
      <div className="rounded-md border border-gray-300 bg-white p-4 shadow-md">
        <p className="mb-2 font-semibold text-gray-800">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
          <p className="text-sm font-semibold text-gray-900">
            Total Submission: {totalSubmission}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
