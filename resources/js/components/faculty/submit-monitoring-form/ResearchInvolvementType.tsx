import React, { useState } from "react";
import {
  Control,
  FieldErrors,
  useController,
  UseFormRegister,
} from "react-hook-form";
import { type FormData } from "./CreateResearchMonitoringForm";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { type ResearchInvolvementType } from "../../shared/types/types";
import DropzoneComponent from "../../shared/components/DropzoneComponent";
import api from "../../api/axios";
import { BiTrash } from "react-icons/bi";
import formatBytes from "../../util/formatBytes";

type StepOneProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  involvementTypes: ResearchInvolvementType[] | undefined;
  loading: boolean;
  control: Control<FormData>;
  setFileList: React.Dispatch<React.SetStateAction<File[]>>;
  fileList: File[];
};

const ResearchInvolvementType = ({
  errors,
  register,
  fileList,
  setFileList,
  involvementTypes,
  loading,
  control,
}: StepOneProps) => {
  const [loadingFile, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dropzoneError, setDropzoneError] = useState<string | null>(null);

  const { field: research_docs } = useController({
    name: "research_documents",
    control,
    defaultValue: [],
  });

  const { field: involvementType } = useController({
    name: "research_involvement_type",
    control,
    defaultValue: 1,
  });

  // const { field: selectedFile } = useController({
  //   name: "selectedFile",
  //   control,
  //   defaultValue: null,
  // });

  const handleUpload = async (files: File[]) => {
    const formImage = new FormData();

    for (const file of files) {
      formImage.append("evidence_path[]", file);
    }

    setLoading(true);
    setUploadProgress(0);
    try {
      const res: { data: { data: string[] } } = await api.post(
        "/api/file-upload-private",
        formImage,
        {
          // Do NOT set Content-Type - browser must add boundary for FormData
          timeout: 120000, // 2 minutes for large files
          onUploadProgress: (progressEvent) => {
            const percent = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(percent);
          },
        }
      );
      setFileList([...fileList, ...files]);
      research_docs.onChange([...research_docs.value, ...res.data.data.flat()]);
    } catch (error) {
      setDropzoneError("Upload failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFileList(fileList.filter((_, i) => i !== index));
    research_docs.onChange(research_docs.value.filter((_, i) => i !== index));
  };

  // const fileLabel =
  //   involvementType.value == 1 ||
  //     involvementType.value == 3 ||
  //     involvementType.value == 4
  //     ? "research"
  //     : "certificate";

  return (
    <div className="flex w-full flex-col items-start justify-center">
      <label
        htmlFor="involvementType"
        className="text-md font-semibold after:ml-1 after:text-red-500 after:content-['*']"
      >
        Determine which research involvement type applies
      </label>
      {loading ? (
        <AiOutlineLoading3Quarters className="my-3 size-5 animate-spin" />
      ) : !involvementTypes?.length ? (
        <p className="mt-3 text-sm text-amber-600">
          Unable to load research involvement types. Please refresh the page.
        </p>
      ) : (
        <select
          id="involvementType"
          className="text-md mt-3 w-full cursor-pointer rounded-md border border-gray-800 bg-white p-1.5 capitalize"
          {...register("research_involvement_type", {
            required: "Please select a research involvement type",
            valueAsNumber: true,
          })}
        >
          <option value={0} disabled>
            Select your research involvement type
          </option>

          {involvementTypes?.map((type) => (
            <option
              className="bg-white p-1 text-sm capitalize"
              value={type.id}
              key={type.id}
            >
              {type.research_involvement_type}
            </option>
          ))}
        </select>
      )}
      <p className="mt-2 text-sm text-red-500">
        {errors.research_involvement_type?.message}
      </p>

      <label
        htmlFor="researchDocs"
        className="text-md mt-10 font-semibold after:ml-1 after:text-red-500 after:content-['*']"
      >
        Upload your research related document(s)
      </label>

      <DropzoneComponent
        accept={{ "image/*": [".jpeg", ".png"], "application/pdf": [".pdf"] }}
        maxSize={10485760}
        minSize={0}
        maxFiles={5}
        onFilesAccepted={(files) => {
          setDropzoneError(null); // Clear any previous error
          handleUpload(files);
        }}
        onFilesRejected={(fileRejections) => {
          const formattedMessages = fileRejections.map((rejection) => {
            const fileName = rejection.file.name;

            const typeError = rejection.errors.find(
              (e) => e.code === "file-invalid-type"
            );
            if (typeError) {
              return `${fileName}: The uploaded file must be a PDF or an image in JPEG or PNG format.`;
            }

            return rejection.errors
              .map((e) => `${fileName}: ${e.message}`)
              .join(", ");
          });

          setDropzoneError(formattedMessages.join(" "));
        }}
      />

      {dropzoneError && (
        <p className="mt-2 text-sm text-red-500">{dropzoneError}</p>
      )}

      <div className="mt-2 w-full">
        <p className="text-md font-semibold">Uploaded files</p>
        {/* <p className="text-md my-2 text-gray-800">
          Important: Click to select your{" "}
          <span className="text-blue-500">{fileLabel}</span> from the uploaded
          files.
        </p> */}

        {fileList.length === 0 ? (
          <>
            {loadingFile ? (
              <div className="my-5 w-full">
                <div className="flex items-center justify-start gap-x-2">
                  <AiOutlineLoading3Quarters className="size-6 animate-spin" />
                  <p className="text-sm">
                    Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
                  </p>
                </div>
                {uploadProgress > 0 && (
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <p className="my-5 text-center">
                  You have no uploaded file(s) yet...
                </p>
                <p className="mt-2 text-red-500">
                  {errors.research_documents?.message}
                </p>
              </>
            )}
          </>
        ) : (
          <>
            {fileList.map((file, index) => (
              <div key={index} className="my-5 flex justify-between gap-2">
                <div className="flex w-full gap-x-1.5 border-b border-b-gray-400 pb-1">
                  <p className="line-clamp-1">
                    {file.name} - {formatBytes(file.size)}
                  </p>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => handleRemoveFile(index)}
                >
                  <BiTrash className="size-5 self-end text-red-500" />
                </button>
              </div>
            ))}
            {/* <p className="my-2 text-wrap text-red-500">
              {errors.selectedFile?.message}
            </p> */}
          </>
        )}
      </div>
    </div>
  );
};

export default ResearchInvolvementType;
