import React, { useEffect, useState } from "react";
import {
  Control,
  FieldErrors,
  useController,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { FormData } from "../CreateResearchMonitoringForm";
import { CiCircleQuestion } from "react-icons/ci";
import Tooltip from "../../../shared/components/Tooltip";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import api from "../../../api/axios";
import Button from "../../../shared/components/Button";
import authorsArray from "../../../util/parseAuthors";
import { BiSearch, BiLinkExternal } from "react-icons/bi"; // Ensure BiLinkExternal is imported
import useCrossrefApi from "../crossref/useCrossrefApi";
import { useCitationsPoints } from "../points/usePoints";

type ResearchType = { type: string; id: number };
type ResearchField = { field: string; id: number };
type SocioEconomicObjective = { type: string; id: number };

type DataType = {
  research_type: ResearchType[];
  research_field: ResearchField[];
  socio_economic_objective: SocioEconomicObjective[];
};

type CitationsProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  researchDetails: DataType | undefined;
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
  setError: UseFormSetError<FormData>;
  clearError: UseFormClearErrors<FormData>;
};

async function checkScopus(authors: string, researchTitle: string) {
  const arrayAuthors = authorsArray(authors);
  const res = await api.post("/api/check-scopus", {
    authors: arrayAuthors,
    research_title: researchTitle,
  });
  return res.data.data;
}

const Citations = ({ register, errors, control, setValue }: CitationsProps) => {
  const { field: points } = useController({
    name: "citations.points",
    control,
  });

  const [citedIsScopus, setCitedIsScopus] = useState<boolean | null>(null);

  const citedResearch = useWatch({
    name: "citations.cited_article_title",
    control,
  });
  const citedAuthors = useWatch({ name: "citations.cited_authors", control });
  const title = useWatch({ name: "citations.research_title", control });
  const authors = useWatch({ name: "citations.authors", control });
  const url = useWatch({ name: "citations.url_link", control });
  const scopusLink = useWatch({ name: "citations.scopus_link", control });

  const { data: response, isLoading } = useCrossrefApi(title, authors);

  const { points: citationsPoints, totalPoints } = useCitationsPoints(
    citedIsScopus,
    authors,
    citedAuthors,
  );

  useEffect(() => {
    setCitedIsScopus(null);
  }, [citedResearch]);

  const scopusMutation = useMutation({
    mutationFn: ({
      citedAuthors,
      citedResearch,
    }: {
      citedAuthors: string;
      citedResearch: string;
    }) => checkScopus(citedAuthors, citedResearch),
    onSuccess: (data) => {
      if (data.exists) {
        setValue(
          "citations.scopus_link",
          data.data[0].link[2]["@href"] as string,
        );
        setCitedIsScopus(true);
      } else {
        setCitedIsScopus(false);
      }
    },
  });

  useEffect(() => {
    points.onChange(citationsPoints);
  }, [citationsPoints, points]);

  useEffect(() => {
    if (!response) return;

    setValue("citations.url_link", response.article_link);
    setValue("citations.date", response.date);
    setValue("citations.publisher_name", response.editor_publisher);
    setValue("citations.journal_title", response.journal_name);
    setValue("citations.issno_vol_pages", response.issno_vol_pages);
    setValue("citations.date", response.date);
  }, [response, setValue]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Published Research Details
      </h1>

      {isLoading && (
        <div className="my-5 flex items-center justify-start gap-x-2">
          <AiOutlineLoading3Quarters className="size-8 animate-spin" />
          <p>Fetching your published research online</p>
        </div>
      )}
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
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("citations.research_title", {
              required: "Research Title is required",
              max: 100,
              min: 10,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.citations?.research_title?.message}
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
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("citations.authors", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.citations?.authors?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="journalName"
          >
            Journal Name
          </label>
          <input
            id="journalName"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("citations.journal_title", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.citations?.journal_title?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="editor"
          >
            Editor/Publisher of Journal
          </label>
          <input
            id="editor"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("citations.publisher_name", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.citations?.publisher_name?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="issno"
          >
            ISSN NO./Vol/Page No.
          </label>
          <input
            id="issno"
            className="h-9 rounded-md border border-gray-800 p-1"
            type="url"
            {...register("citations.issno_vol_pages", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.citations?.issno_vol_pages?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="publishedDate"
          >
            Date Published
          </label>
          <input
            id="publishedDate"
            className="h-9 rounded-md border border-gray-800 p-1"
            type="date"
            {...register("citations.date", {
              required: "This field is required",
              valueAsDate: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.citations?.date?.message}
          </p>
        </div>

        {/* --- FIXED: Separated Input and Link Button --- */}
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="articleLink"
          >
            URL Link of Article
          </label>
          <div className="flex items-center gap-2">
            <input
              id="articleLink"
              className="h-9 flex-1 rounded-md border border-gray-800 p-1"
              type="url"
              {...register("citations.url_link", {
                required: "This field is required",
              })}
            />
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300"
                title="Open Link"
              >
                <BiLinkExternal />
              </a>
            )}
          </div>
          <p className="my-1.5 text-red-500">
            {errors.citations?.url_link?.message}
          </p>
        </div>
        {/* ---------------------------------------------- */}

        <div className="col-span-2">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Citation Research Details
          </h1>

          <hr className="my-2 w-full border-2 border-gray-700" />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="citedArticle"
          >
            Citation Research Article
          </label>
          <input
            id="citedArticle"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("citations.cited_article_title", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.citations?.cited_article_title?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="citedAuthors"
          >
            Citation Research Authors
          </label>
          <input
            id="citedAuthors"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("citations.cited_authors", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.citations?.cited_authors?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            isDisabled={
              scopusMutation.isLoading || !citedAuthors || !citedResearch
            }
            className="rounded-lg bg-green-500 p-3 text-white disabled:cursor-not-allowed"
            type="button"
            onClick={() =>
              scopusMutation.mutate({ citedAuthors, citedResearch })
            }
          >
            {scopusMutation.isLoading ? (
              <div className="inline-flex items-center justify-center gap-1">
                <AiOutlineLoading3Quarters className="size-5 animate-spin" />
                <span>Checking Scopus...</span>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center gap-1">
                <BiSearch className="size-5" />
                <span>Check Scopus</span>
              </div>
            )}
          </Button>

          {citedIsScopus === false && (
            <p className="my-1 text-red-500">
              Research article not found on Scopus
            </p>
          )}
        </div>
        
        {/* --- FIXED: Separated Input and Link Button for Scopus --- */}
        {citedIsScopus && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="scopusLink">
              Scopus Link of Research who cited your work
            </label>
            <div className="flex items-center gap-2">
              <input
                id="scopusLink"
                className="h-9 flex-1 rounded-md border border-gray-800 p-1"
                type="url"
                {...register("citations.scopus_link")}
              />
              {scopusLink && (
                <a
                  href={scopusLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300"
                  title="Open Scopus Link"
                >
                  <BiLinkExternal />
                </a>
              )}
            </div>
            <p className="my-1.5 text-red-500">
              {errors.citations?.scopus_link?.message}
            </p>
          </div>
        )}
        {/* -------------------------------------------------------- */}

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
              text={`You earn ${totalPoints.scopus} points if the research article cited your work is indexed in Scopus while  ${totalPoints.non_scopus} points for non-Scopus. 0 points for self-citation.`}
            >
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
        </div>
        <p className="my-1.5 text-red-500">
          {errors.citations?.points?.message}
        </p>
      </div>
    </>
  );
};

export default Citations;