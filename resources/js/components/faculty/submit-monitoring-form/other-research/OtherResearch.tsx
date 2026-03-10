// import React, { useEffect } from "react";
// import {
//   Control,
//   FieldErrors,
//   useController,
//   UseFormRegister,
//   useWatch,
// } from "react-hook-form";
// import { FormData } from "../CreateResearchMonitoringForm";

// import { CiCircleQuestion } from "react-icons/ci";
// import Tooltip from "../../../shared/components/Tooltip";
// import { useGetOtherResearchPoints } from "../points/usePoints";
// import { COVERAGES } from "../../../shared/types/types";

// type OtherResearchProps = {
//   register: UseFormRegister<FormData>;
//   errors: FieldErrors<FormData>;
//   control: Control<FormData>;
// };

// const OtherResearch = ({ register, errors, control }: OtherResearchProps) => {
//   const { field: points } = useController({
//     name: "peerjournal.points",
//     control,
//   });

//   const coverage = useWatch({ name: "peerjournal.coverage", control });
//   const article = useWatch({ name: "peerjournal.article_reviewed", control });
//   const abstract = useWatch({ name: "peerjournal.abstract_reviewed", control });

//   const { points: totalPoints } = useGetOtherResearchPoints()

//   useEffect(() => {
//     points.onChange(totalPoints);
//   }, [totalPoints, points]);

//   return (
//     <>
//       <h1 className="mb-4 text-2xl font-bold text-gray-800">
//         Peer Review Journal Details
//       </h1>

//       <hr className="my-2 w-full border-2 border-gray-700" />

//       <div className="mt-10 grid w-full grid-cols-2 gap-5">
//         <div className="flex flex-col gap-2">
//           <label
//             className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="type"
//           >
//             Journal Name
//           </label>
//           <input
//             id="type"
//             className="h-9 rounded-md border border-gray-800 p-1"
//             {...register("peerjournal.journal_name", {
//               required: "This field is required",
//             })}
//           />
//           <p className="my-1.5 text-red-500">
//             {errors.peerjournal?.journal_name?.message}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label
//             className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="title"
//           >
//             Article Title Reviewed
//           </label>
//           <input
//             id="title"
//             className="h-9 rounded-md border border-gray-800 p-1"
//             {...register("peerjournal.article_title")}
//           />
//           <p className="my-1.5 text-red-500">
//             {errors.peerjournal?.article_title?.message}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label
//             className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="documentId"
//           >
//             Number of Article Reviewed
//           </label>
//           <input
//             id="documentId"
//             className="h-9 rounded-md border border-gray-800 p-1"
//             {...register("peerjournal.article_reviewed")}
//           />
//           <p className="my-1.5 text-red-500">
//             {errors.peerjournal?.article_reviewed?.message}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label
//             className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="registration"
//           >
//             Abstract Title Reviewed
//           </label>
//           <input
//             id="registration"
//             type="date"
//             className="h-9 rounded-md border border-gray-800 p-1"
//             {...register("peerjournal.abstract_title")}
//           />
//           <p className="my-1.5 text-red-500">
//             {errors.peerjournal?.abstract_title?.message}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label
//             className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="abstractNumber"
//           >
//             Number of Abstract Reviewed
//           </label>
//           <input
//             id="abstractNumber"
//             className="h-9 rounded-md border border-gray-800 p-1"
//             {...register("peerjournal.abstract_reviewed")}
//           />
//           <p className="my-1.5 text-red-500">
//             {errors.peerjournal?.abstract_reviewed?.message}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label
//             className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="publication"
//           >
//             Date Reviewed
//           </label>
//           <input
//             id="publication"
//             type="date"
//             className="h-9 rounded-md border border-gray-800 p-1"
//             {...register("peerjournal.date_reviewed", {
//               valueAsDate: true,
//             })}
//           />
//           <p className="my-1.5 text-red-500">
//             {errors.peerjournal?.date_reviewed?.message}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label
//             className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="coverage"
//           >
//             Coverage of the Journal
//           </label>
//           <select
//             id="coverage"
//             className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
//             {...register("peerjournal.coverage", {
//               required: "This field is required",
//             })}
//           >
//             {Object.values(COVERAGES).map((coverage) => (
//               <option key={coverage} value={coverage}>
//                 {coverage}
//               </option>
//             ))}
//           </select>
//           <p className="my-1.5 text-red-500">
//             {errors.peerjournal?.coverage?.message}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label
//             className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="org"
//           >
//             Organization
//           </label>
//           <input
//             id="org"
//             className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
//             {...register("peerjournal.organization", {
//               required: "This field is required",
//             })}
//           />

//           <p className="my-1.5 text-red-500">
//             {errors.intellectual?.processor_name?.message}
//           </p>
//         </div>
//         <div className="flex flex-col gap-2">
//           <label
//             className="w-full font-semibold after:ms-1 after:text-red-500 after:content-['*']"
//             htmlFor="points"
//           >
//             Points
//           </label>
//           <div className="flex items-center justify-between gap-x-2">
//             <div
//               id="points"
//               className="h-9 flex-1 rounded-md border border-green-500 p-1 outline-none"
//             >
//               {points.value}
//             </div>
//             <Tooltip
//               text={`Total points earned for ${coverage} is ${totalPoints} points multiply the number of article ${article} or abstract ${abstract}. Your points is ${points} points.`}
//             >
//               <CiCircleQuestion className="h-5 w-5" />
//             </Tooltip>
//           </div>
//         </div>
//         <p className="my-1.5 text-red-500">
//           {errors.peerjournal?.points?.message}
//         </p>
//       </div>
//     </>
//   );
// };

// export default OtherResearch;
