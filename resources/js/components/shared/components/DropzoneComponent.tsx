import React, { useCallback, useState } from "react";
import {
  useDropzone,
  FileRejection,
  DropzoneRootProps,
  DropzoneInputProps,
} from "react-dropzone";

interface DropzoneComponentProps {
  onFilesAccepted: (acceptedFiles: File[]) => void;
  onFilesRejected?: (fileRejections: FileRejection[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  children?:
    | React.ReactNode
    | ((props: DropzoneRenderProps) => React.ReactNode);
  multiple?: boolean;
}

interface DropzoneRenderProps {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  acceptedFiles: File[];
  rejectedFiles: FileRejection[];
}

function DropzoneComponent({
  onFilesAccepted,
  onFilesRejected,
  accept,
  maxSize,
  minSize,
  maxFiles,
  children,
  multiple = true,
}: DropzoneComponentProps) {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      setAcceptedFiles(acceptedFiles);
      onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      setRejectedFiles(fileRejections);
      if (onFilesRejected) {
        onFilesRejected(fileRejections);
      }
    },
    [onFilesRejected],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept,
    maxSize,
    minSize,
    maxFiles,
    onDropAccepted,
    onDropRejected,
    multiple,
  });

  const renderProps: DropzoneRenderProps = {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    rejectedFiles,
  };

  if (typeof children === "function") {
    return children(renderProps);
  }

  return (
    <>
      <div
        {...getRootProps({
          className:
            "h-32 w-full border border-dashed rounded-lg border-blue-500 cursor-pointer hover: border-2 mt-5 mb-10",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-md text-center">
              Drag and drop some files here, or{" "}
              <span className="block text-blue-500 hover:underline">
                click to select files
              </span>
            </p>
            <p className="mt-2 text-xs">
              Supported files:
              <span className="ml-1 italic">PDF, JPEG, JPG, PNG</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default DropzoneComponent;
