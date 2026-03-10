import { useEffect, useState } from "react";
import ResearchInvolvementType from "./ResearchInvolvementType";
import Stepper from "./Stepper";
import { useForm } from "react-hook-form";
import useGetResearchInvolvementTypes from "../hooks/useGetResearchInvolvementTypes";
import SdgAgenda from "./SdgAgenda";
import useGetSdgAgenda from "../hooks/useGetSdgAgenda";
import ResearchInvolvementDetails from "./ResearchInvolvementDetails";
import {
  CitationsType,
  Completedresearchprod,
  IntellectualPropertyType,
  OtherResearchType,
  PeerReviewType,
  Presentedresearchprod,
  Publishedresearchprod,
  Research,
  ResearchAttendance,
} from "../../shared/types/types";
import axios from "axios";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import { useToast } from "../../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useValidateDocument } from "./useValidateDocument";
import { useMutationResearchMonitoringForm } from "../../admin/monitoring-form/hooks/hook";

export type FormData = {
  research_involvement_type: number;
  research_documents: string[];
  sdg_mappings: number[];
  agenda_mappings: number[];
  selectedFile: number | null;
  completed: Completedresearchprod &
    Omit<Research, "id" | "user_id"> & { points: number };
  presented: Presentedresearchprod & { points: number };
  published: Publishedresearchprod &
    Omit<Research, "id" | "user_id"> & { points: number };
  citations: CitationsType & { points: number };
  participation: ResearchAttendance & { points: number };
  intellectual: IntellectualPropertyType & { points: number };
  peerjournal: PeerReviewType & { points: number };
  otherresearch: OtherResearchType & { points: number };
};

export type PayloadType = {
  research_involvement_type: number;
  research_documents: string[];
  sdg_mappings: number[];
  agenda_mappings: number[];
};

const CreateResearchMonitoringForm = () => {
  const toast = useToast();
  const {
    register,
    clearErrors,
    setValue,
    watch,
    setError,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      research_involvement_type: 0,
      research_documents: [],
      sdg_mappings: [],
      agenda_mappings: [],
      selectedFile: null,
      completed: {
        //completed
        title: "",
        authorship_nature: "",
        authors: "",
        research_field_id: 1,
        research_type_id: 1,
        socio_economic_objective_id: 1,
        date_completed: undefined,
        nature_fund_source: "",
        target_date_publication: undefined,
        points: 0,
      },
      presented: {
        date_presented: "",
        conference_name: "",
        conference_type: "",
        conference_nature: "",
        conference_place: "",
        conference_organization: "",
        presentation_title: "",
        presenter_name: "",
        points: 0,
      },
      published: {
        title: "",
        authorship_nature: "",
        authors: "",
        research_field_id: 1,
        research_type_id: 1,
        socio_economic_objective_id: 1,
        date: undefined,
        coverage: "",
        indexing: "",
        journal_name: "",
        issno_vol_pages: "",
        editor_publisher: "",
        article_link: "",
        num_citations_date: undefined,
        scopus_link: "",
        points: 0,
      },
      citations: {
        authors: "",
        cited_authors: "",
        cited_article_title: "",
        research_title: "",
        journal_title: "",
        issno_vol_pages: "",
        date: "",
        publisher_name: "",
        url_link: "",
        scopus_link: "",
        points: 0,
      },
      participation: {
        date: "",
        organizer: "",
        research_title: "",
        coverage: "",
        place: "",
        attendance_nature: "",
        fund_source_nature: "",
        conference_type: "",
        points: 0,
      },
      intellectual: {
        property_type: "",
        title: "",
        owner_name: "",
        processor_name: "",
        document_id: "",
        registration_date: "",
        acceptance_date: "",
        publication_date: "",
        grant_date: "",
        expiry_date: "",
        points: 0,
      },
      peerjournal: {
        name: "",
        journal_name: "",
        article_title: "",
        article_reviewed: undefined,
        abstract_reviewed: undefined,
        coverage: "",
        date_reviewed: "",
        organization: "",
        abstract_title: "",
        points: 0,
      },
      otherresearch: {
        research_involvement: "",
        research_title: "",
        fund_source_nature: "",
        date: "",
        points: 0,
      },
    },
  });

  const { data: involvementTypes, isLoading } =
    useGetResearchInvolvementTypes();

  const { mutate: validateDoc, isLoading: loading } = useValidateDocument();

  const { data: sdgAgenda } = useGetSdgAgenda();

  const { Create } = useMutationResearchMonitoringForm();

  const createResearchForm = Create();

  const [fileList, setFileList] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const research_docs = watch("research_documents");
  const isSelectedFileIndex = watch("selectedFile");
  const selectedFile =
    isSelectedFileIndex !== null
      ? research_docs[isSelectedFileIndex]
      : undefined;
  const involvementTypeSelected = watch("research_involvement_type");
  const fileLabel =
    involvementTypeSelected == 1 ||
    involvementTypeSelected == 3 ||
    involvementTypeSelected == 4
      ? "research"
      : "certificate";

  const onSubmit = async (data: FormData) => {
    const validTypes = {
      1: "completed",
      2: "presented",
      3: "published",
      4: "citations",
      5: "participation",
      6: "intellectual",
      7: "peerjournal",
      8: "otherresearch",
    } as const;

    const fieldKey =
      validTypes[involvementTypeSelected as keyof typeof validTypes];

    if (fileList.length === 0) {
      setError("research_documents", {
        message: "Please upload your research document(s)",
        type: "required",
      });
      return;
    }

    if (isSelectedFileIndex == null) {
      setError("selectedFile", {
        message: `Please select your ${fileLabel} from your uploaded files.`,
        type: "required",
      });

      return;
    }
    if (step === 1) {
      validateDoc(
        {
          filePath: selectedFile as string,
          fileLabel: fileLabel,
          involvementType: involvementTypeSelected,
        },
        {
          onSuccess: (resData) => {
            setValue("sdg_mappings", resData.sdg);
            setValue("agenda_mappings", resData.agenda);

            if (fieldKey) {
              setValue(fieldKey, {
                ...data[fieldKey],
                ...resData.entities,
              });
            }
            setStep((prev) => prev + 1);
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              const message =
                error.response?.data?.message ||
                "Validation failed. Click Next to retry.";
              toast.error(message);
            }
          },
        },
      );
    } else if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      const payload: PayloadType = {
        research_involvement_type: data.research_involvement_type,
        research_documents: data.research_documents,
        sdg_mappings: data.sdg_mappings,
        agenda_mappings: data.agenda_mappings,
        ...(fieldKey && { [fieldKey]: data[fieldKey] }),
      };

      setSubmitLoading(true);
      try {
        await createResearchForm.mutateAsync({ fieldKey, payload });
        setSubmitLoading(false);
        toast.success("Research form submitted successfully!");
        navigate(-1);
      } catch (error) {
        setSubmitLoading(false);
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.errors) {
            Object.entries(error.response.data.errors).forEach(
              ([key, messages]) => {
                setError(key as keyof FormData, {
                  type: "server",
                  message: Array.isArray(messages) ? messages[0] : messages,
                });
              },
            );
          }
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          }
        } else {
          toast.error("Failed to submit. Please try again.");
        }
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ResearchInvolvementType
            register={register}
            fileList={fileList}
            setFileList={setFileList}
            control={control}
            involvementTypes={involvementTypes}
            loading={isLoading}
            errors={errors}
          />
        );
      case 2:
        return (
          <SdgAgenda
            selectedFile={selectedFile}
            control={control}
            sdgAgenda={sdgAgenda}
          />
        );

      case 3:
        return (
          <ResearchInvolvementDetails
            clearError={clearErrors}
            setValue={setValue}
            setError={setError}
            control={control}
            involvementType={involvementTypeSelected}
            errors={errors}
            register={register}
          />
        );
    }
  };

  return (
    <section className="w-full">
      <div className="mx-auto flex w-[50rem] flex-col items-start justify-center gap-y-20">
        <Stepper step={step} />

        <form
          className="flex w-full flex-col items-start"
          onSubmit={handleSubmit(onSubmit)}
        >
          {renderStep()}
          <div
            className={`flex w-full ${step === 1 && "flex-row-reverse"} items-center justify-between gap-x-5`}
          >
            {step > 1 && (
              <button
                type="button"
                className="w-20 rounded-lg bg-blue-500 p-2 text-white"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Previous
              </button>
            )}
            {step <= 3 && (
              <button
                type="button"
                className="w-20 rounded-lg bg-blue-500 p-2 text-white"
                onClick={handleSubmit(onSubmit)}
              >
                {step === 3 ? "Submit" : "Next"}
              </button>
            )}
          </div>
        </form>
      </div>
      <LoadingSpinner
        isLoading={loading}
        text={[
          "Validating your document...",
          "Selecting best SDG and Agenda...",
          "Extracting details...",
        ]}
        delay={1000}
      />
      <LoadingSpinner
        isLoading={submitLoading}
        text="Saving your document..."
      />
    </section>
  );
};

export default CreateResearchMonitoringForm;
