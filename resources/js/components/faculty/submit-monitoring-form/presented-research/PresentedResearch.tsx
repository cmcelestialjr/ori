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
import { COVERAGES } from "../../../shared/types/types";
import { useGetPresentedPoints } from "../points/usePoints";

type ResearchType = { type: string; id: number };
type ResearchField = { field: string; id: number };
type SocioEconomicObjective = { type: string; id: number };

type DataType = {
  research_type: ResearchType[];
  research_field: ResearchField[];
  socio_economic_objective: SocioEconomicObjective[];
};

type PresentedResearchProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  researchDetails: DataType | undefined;
  control: Control<FormData>;
};

const PresentedResearch = ({
  register,
  errors,
  control,
}: PresentedResearchProps) => {
  const { field: points } = useController({
    name: "presented.points",
    control,
  });
  const coverage = useWatch({ name: "presented.conference_type", control });

  const { points: presentedPoints } = useGetPresentedPoints(
    coverage.toLowerCase(),
    "presenter",
  );

  useEffect(() => {
    points.onChange(presentedPoints);
  }, [presentedPoints, points]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Presented Research Details
      </h1>

      <hr className="my-2 w-full border-2 border-gray-700" />

      <div className="mt-10 grid w-full grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="researchTitle"
          >
            Presented Research Title
          </label>
          <input
            id="researchTitle"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("presented.presentation_title", {
              required: "Presented title is required",
              max: 100,
              min: 10,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.presented?.presentation_title?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="conferenceName"
          >
            Conference Name
          </label>
          <input
            id="conferenceName"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("presented.conference_name", {
              required: "Conference name is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.presented?.conference_name?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="datePresented"
          >
            Date Presented
          </label>
          <input
            id="datePresented"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("presented.date_presented", {
              required: "Date presented is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.presented?.date_presented?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="conferenceOrg"
          >
            Conference Organization/Agency
          </label>
          <input
            id="conferenceOrg"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("presented.conference_organization", {
              required: "Conference org. is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.presented?.conference_organization?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="conferencePlace"
          >
            Conference Place (Town/City, Country)
          </label>
          <input
            id="conferencePlace"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("presented.conference_place", {
              required: "Conference place is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.presented?.conference_place?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="conferenceNature"
          >
            Conference Nature (Invitation/Application)
          </label>
          <select
            id="conferenceNature"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("presented.conference_nature", {
              required: "Conference nature is required",
            })}
          >
            <option value="invitation">Invitation</option>
            <option value="application">Application</option>
          </select>
          <p className="my-1.5 text-red-500">
            {errors.presented?.conference_nature?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="conferenceType"
          >
            Conference Type
          </label>
          <select
            id="conferenceType"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("presented.conference_type", { required: true })}
          >
            {Object.values(COVERAGES).map((coverage) => (
              <option key={coverage} value={coverage}>
                {coverage}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.presented?.conference_type?.message}
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
              text={`${coverage} presentations are given ${presentedPoints} points.`}
            >
              <CiCircleQuestion className="size-5" />
            </Tooltip>
          </div>
        </div>
        <p className="my-1.5 text-red-500">
          {errors.presented?.points?.message}
        </p>
      </div>
    </>
  );
};

export default PresentedResearch;
