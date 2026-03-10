import { useParams } from "react-router-dom";
import useGetMonitoringForm from "../../../shared/hooks/useGetMonitoringForm";
import { STATUS_TYPE } from "../../../shared/types/types";
import Badge from "../../../shared/components/Badge";
import IntellectualPropertyForm from "./IntellectualPropertyForm";
import CompletedResearchForm from "./CompletedResearchForm";
import PublishedResearchForm from "./PublishedResearchForm";
import PresentedResearchForm from "./PresentedResearchForm";
import ParticipationToResearch from "./ParticipationToResearch";
import CitationsForm from "./CitationsForm";
import PeerReviewForm from "./PeerReviewForm";
import OtherResearchForm from "./OtherResearchForm";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AdminMonitoringFormDetails = () => {
  const { id } = useParams();

  const { data, isLoading: loading } = useGetMonitoringForm(id as string);

  const fullName = `${data?.users.fname} ${data?.users.mi ? data?.users.mi + ". " : ""}${data?.users.lname} ${data?.users.suffix ? data?.users.suffix : ""}`;

  if (loading)
    return <AiOutlineLoading3Quarters className="my-5 size-7 animate-spin" />;

  return (
    <section>
      <div className="rounded-md bg-white p-10 shadow-custom">
        {/* Start user data */}
        {data && (
          <div className="flex items-center gap-x-5">
            {data?.users.image_path ? (
              <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-blue-500">
                <img
                  src={data?.users.image_path}
                  alt="Profile Image"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <span
                className={`grid h-20 w-20 place-content-center rounded-full bg-blue-800 text-3xl font-semibold text-white`}
              >
                {data?.users.fname.charAt(0)}
              </span>
            )}

            <div className="flex flex-1 justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{fullName}</h2>
                <p className="inline text-sm text-gray-800">
                  {data?.users.email} - {data?.users.unit}
                </p>
              </div>
              <h2
                className={`text-3xl font-bold ${
                  data?.status === STATUS_TYPE.PENDING
                    ? "text-yellow-800"
                    : data?.status === STATUS_TYPE.APPROVED
                      ? "text-blue-800"
                      : data?.status === STATUS_TYPE.EVALUATED
                        ? "text-green-800"
                        : STATUS_TYPE.REJECT && "text-red-800"
                }`}
              >
                {data?.points.points}
              </h2>
            </div>
          </div>
        )}

        {/* End user data */}

        <hr className="my-5 self-center border bg-gray-900 px-80" />

        {/* Research Content */}

        <div className="mb-5 flex justify-between">
          <h2 className="text-xl font-semibold capitalize">
            {data?.researchinvolvement.research_involvement_type}
          </h2>

          <Badge type={data?.status} />
        </div>
        {data?.rejected_message && (
          <p className="mx-auto mb-2 mt-5 text-sm text-red-500">
            {data.rejected_message}
          </p>
        )}
        {data?.attendancetoresearch && (
          <ParticipationToResearch
            documents={data.researchdocuments}
            formStatus={data.status}
            participation={data.attendancetoresearch}
            points={data.points.points}
          />
        )}
        {data?.presentedresearchprod && (
          <PresentedResearchForm
            points={data.points.points}
            formStatus={data.status}
            presented={data.presentedresearchprod}
            documents={data.researchdocuments}
          />
        )}

        {data?.completedresearchprod && (
          <CompletedResearchForm
            completedresearchprod={data.completedresearchprod}
            documents={data.researchdocuments}
            formStatus={data.status}
            points={data.points.points}
          />
        )}
        {data?.citations && (
          <CitationsForm
            citations={data.citations}
            documents={data.researchdocuments}
            formStatus={data.status}
            points={data.points.points}
          />
        )}
        {data?.publishedresearchprod && (
          <PublishedResearchForm
            points={data.points.points}
            documents={data.researchdocuments}
            formStatus={data.status}
            publishedresearch={data.publishedresearchprod}
          />
        )}
        {data?.intellectualproperty && (
          <IntellectualPropertyForm
            documents={data.researchdocuments}
            formStatus={data.status}
            intellectualproperty={data.intellectualproperty}
            points={data.points.points}
          />
        )}

        {data?.peerreview && (
          <PeerReviewForm
            documents={data.researchdocuments}
            formStatus={data.status}
            peerreview={data.peerreview}
            points={data.points.points}
          />
        )}

        {data?.otherresearch && (
          <OtherResearchForm
            documents={data.researchdocuments}
            formStatus={data.status}
            otherresearch={data.otherresearch}
            points={data.points.points}
          />
        )}
      </div>
    </section>
  );
};

export default AdminMonitoringFormDetails;
