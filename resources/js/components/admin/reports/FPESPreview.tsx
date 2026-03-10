import { PDFViewer } from "@react-pdf/renderer";
import FPESReport, { FPESReportProps } from "./FPES/FPESReport";
import { useLocation } from "react-router-dom";

const FPESPreview = () => {
  const location = useLocation();
  const { data } = location.state as { data: FPESReportProps["data"] };

  return (
    <PDFViewer width="100%" height="1000">
      <FPESReport data={data} />
    </PDFViewer>
  );
};

export default FPESPreview;
