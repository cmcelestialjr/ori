import React, { useState } from "react";
import { useMutateBackup, useUploadFiles } from "../monitoring-form/hooks/hook";
import DropzoneComponent from "../../shared/components/DropzoneComponent";
import { useToast } from "../../../hooks/useToast";
import { BiTrash } from "react-icons/bi";
import formatBytes from "../../util/formatBytes";

type FileListType = {
  file: File;
  filePath: string | null;
};

// const customStyles = {
//   table: {
//     style: {
//       overflow: "visible",
//     },
//   },
//   tableWrapper: {
//     style: {
//       overflow: "visible",
//     },
//   },
//   responsiveWrapper: {
//     style: {
//       overflow: "visible",
//     },
//   },
//   rows: {
//     style: {
//       minHeight: "72px",
//       overflow: "visible",
//       userSelect: "text",
//     },
//   },
//   headCells: {
//     style: {
//       paddingLeft: "8px",
//       paddingRight: "8px",
//     },
//   },
//   cells: {
//     style: {
//       paddingLeft: "8px",
//       paddingRight: "8px",
//       overflow: "visible",
//       userSelect: "text",
//     },
//   },
// };

const Backup = () => {
  const toast = useToast();
  const { CreateBackup, RestoreBackup } = useMutateBackup();

  const { mutate: UploadFiles } = useUploadFiles();

  const { createBackup, isLoading: createLoading } = CreateBackup();

  const restoreBackup = RestoreBackup();

  //const [openDropdownRow, setOpenDropdownRow] = useState<number | null>(null);
  const [fileList, setFileList] = useState<FileListType | null>(null);

  const handleBackup = () => {
    createBackup(undefined, {
      onSuccess: () => toast.success("Backup Data Successfully."),
      onError: () => toast.error("Backup failed. Please try again."),
    });
  };

  const handleRestore = async () => {
    try {
      await restoreBackup.mutateAsync(fileList?.filePath as string);
      toast.success("Data Restored Successfully.");
      setFileList(null);
    } catch {
      toast.error("Restore failed. Please try again.");
    }
  };

  // const handleDelete = async (backupId: number) => {
  //   if (confirm("Are you sure you want to delete backup file?")) {
  //     await deleteBackup.mutateAsync(backupId);
  //   }
  //   setOpenDropdownRow(null);
  // };

  // const handleDownload = async (backupId: number) => {
  //   setOpenDropdownRow(null);
  //   await downloadBackup.mutateAsync(backupId);
  // };

  const handleUpload = (files: File[]) => {
    UploadFiles(files, {
      onSuccess: (uploadedPath) => {
        setFileList({ file: files[0], filePath: uploadedPath[0] });
      },
      onError: (error) => {
        console.error("Upload failed:", error);
      },
    });
  };

  // const columns: TableColumn<BackupFilesType>[] = [
  //   {
  //     name: "File Name",
  //     selector: (row) => row.file_name,
  //   },
  //   {
  //     name: "Backup Date",
  //     cell: (row) => parseDate(row.created_at, true),
  //   },
  //   {
  //     name: "File Size",
  //     selector: (row) => row.file_size,
  //   },
  //   {
  //     name: "",
  //     cell: (row) => (
  //       <div className="relative overflow-visible">
  //         <button
  //           onClick={() =>
  //             setOpenDropdownRow((prev) => (prev === row.id ? null : row.id))
  //           }
  //           className="rounded-lg p-2 hover:bg-gray-100"
  //         >
  //           <HiDotsVertical />
  //         </button>

  //         {openDropdownRow === row.id && (
  //           <div className="absolute right-0 top-6 z-50 mt-2 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
  //             <button
  //               onClick={() => handleRestore()}
  //               className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
  //             >
  //               Restore
  //             </button>
  //             <button
  //               onClick={() => handleDownload(row.id)}
  //               className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
  //             >
  //               Download
  //             </button>
  //             <button
  //               onClick={() => handleDelete(row.id)}
  //               className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
  //             >
  //               Delete
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     ),

  //     right: true,
  //     width: "60px",
  //     ignoreRowClick: true,
  //     allowOverflow: true,
  //     button: true,
  //   },
  // ];

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Backup &amp; Restore
      </h2>

      <div className="space-y-6">
        <div className="rounded-md border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-medium text-gray-700">
            Backup Data
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Create a backup file of your current settings and data.
          </p>

          <button
            onClick={handleBackup}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={createLoading}
          >
            {createLoading ? "Processing..." : "Create Backup"}
          </button>
        </div>
        <div className="rounded-md border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-medium text-gray-700">
            Restore Data
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Restore database and files from a backup file. This will overwrite
            your current settings and data with the backup file.
            <span className="ml-1 font-bold">
              Please ensure you have a recent backup before proceeding
            </span>
            .
          </p>
          <DropzoneComponent
            onFilesAccepted={handleUpload}
            maxFiles={1}
            multiple={false}
            accept={{ "application/zip": [".zip"] }}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
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
                      Drag and drop your backup file here, or{" "}
                      <span className="block text-blue-500 hover:underline">
                        click to select file
                      </span>
                    </p>
                    <p className="mt-2 text-xs">
                      Supported file:
                      <span className="ml-1 italic">Zip</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </DropzoneComponent>

          {fileList && (
            <>
              <div className="my-5 flex justify-between gap-2">
                <div className="flex w-full gap-x-1.5 border-b border-b-gray-400 pb-1">
                  <p className="line-clamp-1">
                    {fileList.file.name} - {formatBytes(fileList.file.size)}
                  </p>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => setFileList(null)}
                >
                  <BiTrash className="size-5 self-end text-red-500" />
                </button>
              </div>
              <button
                onClick={() => handleRestore()}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={restoreBackup.isLoading}
              >
                {restoreBackup.isLoading ? "Processing..." : "Restore Data"}
              </button>
            </>
          )}
        </div>
        {/* <div className="overflow-visible rounded-md border border-gray-200 p-4">
          <h3 className="mb-3 text-lg font-medium text-gray-700">
            Your backup list
          </h3>

          <p className="mb-4 text-sm text-gray-600">
            The backup files listed below are available for download or
            deletion. You can restore your system to a previous state using
            these files. Please note that restoring a backup will overwrite your
            current data.
          </p> 

          <DataTable
            data={backupList}
            columns={columns}
            progressComponent={
              <AiOutlineLoading3Quarters className="size-7 animate-spin" />
            }
            progressPending={backupLoading}
            customStyles={customStyles}
            className="overflow-visible"
            pagination
            responsive
          /> 
        </div> */}
      </div>
    </div>
  );
};

export default Backup;
