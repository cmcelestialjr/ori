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
import { useGetIntellectualPropertyPoints } from "../points/usePoints";

type IntellectualPropertyProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
};

const IntellectualProperty = ({
  register,
  errors,
  control,
}: IntellectualPropertyProps) => {
  const { field: points } = useController({
    name: "intellectual.points",
    control,
  });
  const type = useWatch({ name: "intellectual.property_type", control });
  const acceptanceDate = useWatch({
    name: "intellectual.acceptance_date",
    control,
  });
  const grantDate = useWatch({ name: "intellectual.grant_date", control });
  const publicationDate = useWatch({
    name: "intellectual.publication_date",
    control,
  });
  const isLNU = useWatch({ name: "intellectual.processor_name", control });

  const { allPoints: total, points: intellectualPoints } =
    useGetIntellectualPropertyPoints({
      type: type,
      acceptance_date: acceptanceDate,
      grant_date: grantDate,
      publication_date: publicationDate,
      isLNU: isLNU.toLowerCase().includes("leyte normal university"),
    });

  const getPointsMessage = (
    type: string | undefined,
    allPoints: {
      inclusion: string;
      points: number;
      status: string | null;
    }[],
  ): string => {
    switch (type) {
      case "copyright":
        return `You earn ${allPoints.find((item) => item.inclusion === "copyright")?.points} points if Leyte Normal University processed your certificate of copyright registration. 0 points if not.`;
      case "industrial design":
      case "trademark":
        return `You earn ${allPoints.find((item) => item.inclusion === "trademark" || item.inclusion === "industrial design")?.points} points for trademark or industrial design.`;
      case "utility model":
        return `You earn ${allPoints.find((item) => item.inclusion === "utility model" && item.status === "accepted")?.points} points if accepted, ${allPoints.find((item) => item.inclusion === "utility model" && item.status === "published")?.points} if published, ${allPoints.find((item) => item.inclusion === "utility model" && item.status === "granted")?.points} if granted.`;
      case "patent/invention":
        return `You earn ${allPoints.find((item) => item.inclusion === "patent/invention" && item.status === "accepted")?.points} points if accepted, ${allPoints.find((item) => item.inclusion === "patent/invention" && item.status === "published")?.points} if published, ${allPoints.find((item) => item.inclusion === "patent/invention" && item.status === "granted")?.points} if granted.`;
      default:
        return "";
    }
  };

  useEffect(() => {
    points.onChange(intellectualPoints);
  }, [intellectualPoints, points]);

  //   type: "",
  //         title: "",
  //         owner_name: "",
  //         processor_name: "",
  //         document_id: "",
  //         registration_date: "",
  //         acceptance_date: "",
  //         publication_date: "",
  //         grant_date: "",
  //         expiry_date: "",
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Intellectual Property Details
      </h1>

      <hr className="my-2 w-full border-2 border-gray-700" />

      <div className="mt-10 grid w-full grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="type"
          >
            Intellectual Property Type
          </label>
          <input
            id="type"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("intellectual.property_type", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.intellectual?.property_type?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="title"
          >
            Intellectual Property Title
          </label>
          <input
            id="title"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("intellectual.title", { required: true })}
          />
          <p className="my-1.5 text-red-500">
            {errors.intellectual?.title?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="documentId"
          >
            Document ID
          </label>
          <input
            id="documentId"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("intellectual.document_id", {
              required: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.intellectual?.document_id?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="registration"
          >
            Registration Date
          </label>
          <input
            id="registration"
            type="date"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("intellectual.registration_date", {
              required: "This field is required.",
              valueAsDate: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.intellectual?.registration_date?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="publication"
          >
            Expiration Date
          </label>
          <input
            id="publication"
            type="date"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("intellectual.expiry_date", {
              valueAsDate: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.intellectual?.expiry_date?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="owner"
          >
            Owner of Intellectual Property
          </label>
          <input
            id="owner"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("intellectual.owner_name", {
              required: "This field is required.",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.intellectual?.owner_name?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="org"
          >
            Organization that processes your intellectual property
          </label>
          <input
            id="org"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("intellectual.processor_name", { required: true })}
          />

          <p className="my-1.5 text-red-500">
            {errors.intellectual?.processor_name?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="grantDate"
          >
            Grant Date
          </label>
          <input
            id="grantDate"
            type="date"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("intellectual.grant_date", {
              valueAsDate: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.intellectual?.grant_date?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="publicationDate"
          >
            Publication Date
          </label>
          <input
            id="publicationDate"
            type="date"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("intellectual.publication_date", {
              valueAsDate: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.intellectual?.publication_date?.message}
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
            <Tooltip text={getPointsMessage(type.toLowerCase(), total)}>
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
        </div>
        <p className="my-1.5 text-red-500">
          {errors.intellectual?.points?.message}
        </p>
      </div>
    </>
  );
};

export default IntellectualProperty;
