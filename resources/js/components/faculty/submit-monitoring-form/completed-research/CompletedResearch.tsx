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
import { FundSourceNatureEnum } from "../../../shared/types/types";
import { useGetCompletedPoints } from "../points/usePoints";

type ResearchType = { type: string; id: number };
type ResearchField = { field: string; id: number };
type SocioEconomicObjective = { type: string; id: number };

type DataType = {
  research_type: ResearchType[];
  research_field: ResearchField[];
  socio_economic_objective: SocioEconomicObjective[];
};

type CompletedResearchProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  researchDetails: DataType | undefined;
  control: Control<FormData>;
};

const CompletedResearch = ({
  researchDetails,
  register,
  errors,
  control,
}: CompletedResearchProps) => {
  const { field: points } = useController({
    name: "completed.points",
    control,
  });
  const authors = useWatch({ name: "completed.authors", control });

  const { points: completedPoints, total } = useGetCompletedPoints(authors);

  useEffect(() => {
    points.onChange(completedPoints);
  }, [completedPoints, points]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Completed Research Details
      </h1>

      <hr className="my-2 w-full border-2 border-gray-700" />

      <div className="mt-10 grid w-full grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="researchTitle"
          >
            Research Title
          </label>
          <input
            id="researchTitle"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("completed.title", {
              required: "Research Title is required",
              max: 100,
              min: 10,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.completed?.title?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="authors"
          >
            Author(s)
          </label>
          <input
            id="authors"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("completed.authors", { required: true })}
          />
          <p className="my-1.5 text-red-500">
            {errors.completed?.authors?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="DateCompleted"
          >
            Date Completed
          </label>
          <input
            id="DateCompleted"
            type="date"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("completed.date_completed", {
              required: true,
              valueAsDate: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.completed?.date_completed?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="publication"
          >
            Target Date Publication
          </label>
          <input
            id="publication"
            type="date"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("completed.target_date_publication", {
              valueAsDate: true,
              validate: (value, formValues) => {
                if (
                  formValues.completed.date_completed &&
                  value &&
                  new Date(value) <= formValues.completed.date_completed
                ) {
                  return "Target publication date must be after date completed";
                }
                return true;
              },
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.completed?.target_date_publication?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="authorship"
          >
            Authorship Nature
          </label>
          <select
            id="authorship"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("completed.authorship_nature", { required: true })}
          >
            <option disabled>Select the nature of your fund source</option>
            <option value="sole author">Sole Author</option>
            <option value="collaborative local">
              Collaborative Local (Within LNU from the same academic unit)
            </option>
            <option value="collaborative">
              Collaborative (Within LNU form different academic unit)
            </option>
            <option value="collaborative outside">
              Collaborative with outside LNU authors
            </option>
          </select>
          <p className="my-1.5 text-red-500">
            {errors.completed?.nature_fund_source?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="fundsource"
          >
            Fund Source Nature
          </label>
          <select
            id="authorship"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("completed.nature_fund_source", { required: true })}
          >
            <option disabled selected>
              Select the nature of your source fund
            </option>
            <option value={FundSourceNatureEnum.LNU_FUNDED_INITIATED}>
              LNU Funded/Initiated
            </option>
            <option value={FundSourceNatureEnum.EXTERNALLY_FUNDED}>
              Externally Funded
            </option>
            <option value={FundSourceNatureEnum.PERSONAL}>
              Personal Capacity
            </option>
          </select>
          <p className="my-1.5 text-red-500">
            {errors.completed?.authorship_nature?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="fieldResearch"
          >
            Field of Research
          </label>
          <select
            id="fieldResearch"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("completed.research_field_id", {
              required: true,
              valueAsNumber: true,
            })}
          >
            <option disabled>Select your field of research</option>
            {researchDetails?.research_field.map((field) => (
              <option key={field.id} value={field.id}>
                {field.field}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.completed?.research_field_id?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="researchType"
          >
            Type of Research
          </label>
          <select
            id="researchType"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("completed.research_type_id", {
              required: true,
              valueAsNumber: true,
            })}
          >
            <option disabled selected>
              Select your type of research
            </option>
            {researchDetails?.research_type.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.completed?.research_type_id?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="socioEconomicObjective"
          >
            Socio-Economic Objective
          </label>
          <select
            id="socioEconomicObjective"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("completed.socio_economic_objective_id", {
              required: true,
              valueAsNumber: true,
            })}
          >
            <option disabled>
              Select the socio economic objective of your research
            </option>
            {researchDetails?.socio_economic_objective.map((objective) => (
              <option key={objective.id} value={objective.id}>
                {objective.type}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.completed?.socio_economic_objective_id?.message}
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
              text={`A completed research production is equivalent to ${total} points which is divided equally among authors.`}
            >
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
        </div>
        <p className="my-1.5 text-red-500">
          {errors.completed?.points?.message}
        </p>
      </div>
    </>
  );
};

export default CompletedResearch;
