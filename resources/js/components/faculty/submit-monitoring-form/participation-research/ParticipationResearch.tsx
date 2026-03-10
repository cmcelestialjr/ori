import React, { useEffect } from "react";
import {
  Control,
  FieldErrors,
  useController,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { FormData } from "../CreateResearchMonitoringForm";

import { CiCircleQuestion } from "react-icons/ci";
import Tooltip from "../../../shared/components/Tooltip";
import { COVERAGES, FundSourceNatureEnum } from "../../../shared/types/types";
import { useGetParticipationPoints } from "../points/usePoints";

type ResearchType = { type: string; id: number };
type ResearchField = { field: string; id: number };
type SocioEconomicObjective = { type: string; id: number };

type DataType = {
  research_type: ResearchType[];
  research_field: ResearchField[];
  socio_economic_objective: SocioEconomicObjective[];
};

type ParticipationResearchProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  researchDetails: DataType | undefined;
  control: Control<FormData>;
};

const ParticipationResearch = ({
  register,
  errors,
  control,
}: ParticipationResearchProps) => {
  const { field: points } = useController({
    name: "participation.points",
    control,
  });

  const coverage = useWatch({ name: "participation.coverage", control });
  const category = useWatch({
    name: "participation.attendance_nature",
    control,
  });
  const date = useWatch({ name: "participation.date", control });

  const { points: participationPoints } = useGetParticipationPoints(
    coverage,
    category,
    date,
  );

  useEffect(() => {
    points.onChange(participationPoints);
  }, [participationPoints, points]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Participation to Research/Seminar/Activity Details
      </h1>

      <hr className="my-2 w-full border-2 border-gray-700" />

      <div className="mt-10 grid w-full grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="researchTitle"
          >
            Activity/Research/Seminar Title
          </label>
          <input
            id="researchTitle"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("participation.research_title", {
              required: "Title is required",
              max: 100,
              min: 10,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.participation?.research_title?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="attendanceNature"
          >
            Nature of Attendance
          </label>
          <input
            id="attendanceNature"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("participation.attendance_nature", {
              required: "Attendance nature is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.participation?.attendance_nature?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="conferenceOrg"
          >
            Organization of research/seminar/activity
          </label>
          <input
            id="conferenceOrg"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("participation.organizer", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.participation?.organizer?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="datePresented"
          >
            Date of research/seminar/activity
          </label>
          <input
            id="datePresented"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("participation.date", {
              required: "Date is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.participation?.date?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="conferencePlace"
          >
            Research/Seminar/Activity place/location
          </label>
          <input
            id="conferencePlace"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("participation.place", {
              required: "Place is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.participation?.place?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="coverage"
          >
            Coverage of Research/Seminar/Activity
          </label>
          <select
            id="coverage"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("participation.coverage", { required: true })}
          >
            {Object.values(COVERAGES).map((coverage) => (
              <option key={coverage} value={coverage}>
                {coverage}
              </option>
            ))}
          </select>
          {/* <input
            id="conferenceType"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("participation.coverage", {
              required: "Conference place is required",
            })}
          /> */}
          <p className="my-1.5 text-red-500">
            {errors.participation?.coverage?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="conferenceType"
          >
            Research/Seminar/Activity Type
          </label>
          <select
            id="conferenceType"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("participation.conference_type", { required: true })}
          >
            <option value="managerial">Managerial</option>

            <option value="supervisory">Supervisory</option>

            <option value="technical">Technical</option>

            <option value="research conference">Research Conference</option>
          </select>
          <p className="my-1.5 text-red-500">
            {errors.participation?.conference_type?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="fundSource"
          >
            Nature of Fund Source
          </label>
          <select
            id="fundSource"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("participation.fund_source_nature", {
              required: true,
            })}
          >
            <option value={FundSourceNatureEnum.EXTERNALLY_FUNDED}>
              {FundSourceNatureEnum.EXTERNALLY_FUNDED}
            </option>

            <option value={FundSourceNatureEnum.LNU_FUNDED_INITIATED}>
              {FundSourceNatureEnum.LNU_FUNDED_INITIATED}
            </option>

            <option value={FundSourceNatureEnum.PERSONAL}>
              {FundSourceNatureEnum.PERSONAL}
            </option>
          </select>
          <p className="my-1.5 text-red-500">
            {errors.participation?.fund_source_nature?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="w-full font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="points"
          >
            Points
          </label>
          <div className="flex items-center justify-between gap-x-2">
            <div
              id="points"
              className="h-9 flex-1 rounded-md border border-green-500 p-1 outline-none"
            >
              {points.value}
            </div>
            <Tooltip
              text={`As a ${category.toLowerCase()} to an ${coverage.toLowerCase()} research/seminar/activity, the following is given ${participationPoints} points.`}
            >
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
        </div>
        <p className="my-1.5 text-red-500">
          {errors.participation?.points?.message}
        </p>
      </div>
    </>
  );
};

export default ParticipationResearch;
