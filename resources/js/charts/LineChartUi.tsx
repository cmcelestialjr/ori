import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartsType } from "../components/admin/monitoring-form/hooks/hook";
import { useCallback, useState } from "react";
import CustomTooltip from "./CustomTooltip";
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";
import { HiDotsVertical, HiOutlineDownload } from "react-icons/hi";
import { CiFilter } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LineChartProps {
  data: ChartsType | undefined;
}

const LineChartUi = ({ data }: LineChartProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [filter, setFilter] = useState("Default");
  const [getPng, { ref, isLoading }] = useCurrentPng();

  const chartTitle = `Total ${filter === "Default" ? "of" : filter} Faculty Research Involvement Submission`;

  const handleDownload = useCallback(async () => {
    try {
      const png = await getPng();

      if (png) {
        const canvas = document.createElement("canvas");
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height + 40;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = "#000000";
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
          ctx.fillText(chartTitle, canvas.width / 2, 25);

          ctx.drawImage(img, 0, 40);

          canvas.toBlob((blob) => {
            if (blob) {
              FileSaver.saveAs(blob, `${chartTitle}.png`);
            }
          });
        };

        img.src = png;
      }
    } catch (error) {
      console.error("Error during chart download:", error);
    }
  }, [getPng, chartTitle]);

  const chartData =
    filter === "Default"
      ? data?.default
      : filter === "CAS"
        ? data?.CAS
        : filter === "CME"
          ? data?.CME
          : data?.COE;

  const handleChange = (val: string) => setFilter(val);

  const renderChartLines = () => {
    if (filter === "Default") {
      return (
        <>
          <Tooltip content={<CustomTooltip />} />
          {[
            {
              key: "completed research (unpublished)",
              name: "Completed Research",
              stroke: "#8884d8",
            },
            {
              key: "presented research",
              name: "Presented Research",
              stroke: "#82ca9d",
            },
            {
              key: "published research/creative works",
              name: "Published Research",
              stroke: "#ffc658",
            },
            {
              key: "citations of published research",
              name: "Citations",
              stroke: "#ff7300",
            },
            {
              key: "participation to research/seminar/activity",
              name: "Participation",
              stroke: "#387908",
            },
            {
              key: "intellectual property (utility model/patent/copyright/trademark/industrial)",
              name: "Intellectual Property",
              stroke: "#d62728",
            },
            {
              key: "refereeing in peer-reviewed journal",
              name: "Peer-Review",
              stroke: "#82ca9d",
            },
            {
              key: "other research involvement (panel/statistician/editor/internal/external funded research)",
              name: "Other Research Involvement",
              stroke: "#387908",
            },
            {
              key: "creative works",
              name: "Creative Works",
              stroke: "#d62528",
            },
          ].map(({ key, name, stroke }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={name}
              stroke={stroke}
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          ))}
        </>
      );
    }

    return (
      <>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="year"
          name="Year"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="total_submission"
          name="Total Submission"
          stroke="#82ca9d"
          strokeWidth={2}
        />
      </>
    );
  };

  return (
    <div className="flex h-[30rem] w-full flex-col items-center justify-center rounded bg-secondary p-2 sm:p-5">
      {/* Controls */}
      <div className="relative flex w-full items-center justify-between px-2 sm:px-4">
        <button
          className="cursor-pointer self-start rounded-lg px-2 py-1.5 hover:bg-gray-100 sm:px-4"
          onClick={() => setOpenDropdown(!openDropdown)}
          aria-label="Filter"
        >
          <CiFilter size={23} />
        </button>

        <div className="flex flex-1 justify-center">
          <h2 className="text-center text-sm font-bold sm:text-lg">
            {chartTitle}
          </h2>
        </div>

        <button
          className="cursor-pointer self-start rounded-lg px-2 py-1.5 hover:bg-gray-100 sm:px-4"
          onClick={() => setOpenDownload(!openDownload)}
          aria-label="Options"
        >
          <HiDotsVertical size={23} />
        </button>

        {/* Filter Dropdown */}
        {openDropdown && (
          <div className="absolute left-2 top-10 z-10 flex w-28 flex-col rounded-md bg-white p-2 shadow-md sm:left-4">
            {["Default", "CAS", "CME", "COE"].map((college) => (
              <div
                key={college}
                className="flex w-full flex-row-reverse items-center justify-end gap-x-2"
              >
                <label
                  className="cursor-pointer text-sm font-semibold text-gray-800 sm:text-base"
                  htmlFor={college}
                >
                  {college}
                </label>
                <input
                  type="radio"
                  className="cursor-pointer accent-blue-700"
                  id={college}
                  checked={filter === college}
                  onChange={() => handleChange(college)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Download Dropdown */}
        {openDownload && (
          <div className="absolute right-2 top-10 z-10 flex w-24 flex-col items-start justify-center rounded-md bg-white shadow-md sm:right-4">
            <button
              className="flex w-full items-center justify-center gap-x-1 rounded-md p-1 hover:bg-gray-100"
              onClick={handleDownload}
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <>
                  <HiOutlineDownload />
                  <span className="text-sm">Download</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            ref={ref}
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={filter === "Default" ? "name" : "year"}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              dataKey={filter !== "Default" ? "total_submission" : ""}
              tick={{ fontSize: 12 }}
            />
            {renderChartLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartUi;
