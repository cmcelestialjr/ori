import CompletedResearchPoints from "./completed-research/CompletedResearchPoints";
import ParticipationToResearch from "./participation-to-research/ParticipationToResearch";
import PublishedResearchPoints from "./published-research/PublishedResearchPoints";
import PeerReviewPoints from "./peer-review/PeerReviewPoints";
import CompletedStudentTheses from "./completed-student-theses/CompletedStudentTheses";
import InternalExternalResearchPoints from "./internal-external-research/InternalExternalResearchPoints";
import CitationPoints from "./citation/CitationPoints";
import UtilityPatentCopywritePoints from "./utility-patent-copywrite/UtilityPatentCopywritePoints";

const PointsManagementLayout = () => {
  return (
    <>
      <div className="flex w-full flex-col gap-5">
        <div className="rounded-md border border-gray-400 p-3">
          <CompletedResearchPoints />
        </div>
        <hr className="my-5 h-0.5 w-full bg-gray-400" />
        <div className="rounded-md border border-gray-400 p-3">
          <PublishedResearchPoints />
        </div>
        <hr className="my-5 h-0.5 w-full bg-gray-400" />
        <div className="rounded-md border border-gray-400 p-3">
          <ParticipationToResearch />
        </div>
        <hr className="my-5 h-0.5 w-full bg-gray-400" />
        <div className="rounded-md border border-gray-400 p-3">
          <PeerReviewPoints />
        </div>
        <hr className="my-5 h-0.5 w-full bg-gray-400" />
        <div className="rounded-md border border-gray-400 p-3">
          <CompletedStudentTheses />
        </div>
        <hr className="my-5 h-0.5 w-full bg-gray-400" />
        <div className="rounded-md border border-gray-400 p-3">
          <InternalExternalResearchPoints />
        </div>
        <hr className="my-5 h-0.5 w-full bg-gray-400" />
        <div className="rounded-md border border-gray-400 p-3">
          <CitationPoints />
        </div>
        <hr className="my-5 h-0.5 w-full bg-gray-400" />
        <div className="rounded-md border border-gray-400 p-3">
          <UtilityPatentCopywritePoints />
        </div>
      </div>
    </>
  );
};

export default PointsManagementLayout;
