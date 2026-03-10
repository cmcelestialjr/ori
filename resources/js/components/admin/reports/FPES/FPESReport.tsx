import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { oriBlack, reportHeader } from "../../../../assets/images";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  headerImage: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  oriLogo: {
    width: 110,
    marginLeft: 10,
  },
  section: {
    marginBottom: 15,
  },
  heading: {
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subheading: {
    fontSize: 12,
    marginBottom: 3,
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 3,
  },
  tableCell: {
    fontSize: 10,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  totalRow: {
    fontWeight: "bold",
  },
});

export type FPESReportProps = {
  data: {
    name: string;
    college: string;
    startDate: string;
    endDate: string;
    researchInvolvement: {
      involvement: string;
      points: number;
      confirmation?: string;
      comments?: string;
    }[];
  };
};

const FPESReport = ({ data }: FPESReportProps) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  const formatStartDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
  const formatEndDate = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Calculate total points
  const totalPoints = data.researchInvolvement.reduce((acc, item) => acc + item.points, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerImage}>
          <Image src={reportHeader} />
          <Image src={oriBlack} style={styles.oriLogo} />
        </View>

        <Text style={styles.heading}>Faculty Performance Evaluation Report</Text>

        <View style={styles.section}>
          <Text>Faculty Name: {data.name}</Text>
          <Text>Department: {data.college}</Text>
          <Text>
            Date: {formatStartDate} - {formatEndDate}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Summary of FPES Report</Text>

          <Text style={{fontSize: 10, marginBottom: 10}}>(e.g., published or unpublished research/creative works; attendance, presentation or organizer of research related activities; refereeing; adviser, statistician, panel or editor or finished students’ or externally funded completed researches; patented industrial designs, utility models, inventions, or trademarks)</Text>

          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Research Involvement Type</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Points Earned</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Confirmation</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderCell}>Comments</Text>
              </View>
            </View>

            {/* Table Body */}
            {data.researchInvolvement.map((item, i) => (
              <View style={styles.tableRow} key={i}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.involvement}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.points}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.confirmation ?? ""}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.comments ?? ""}</Text>
                </View>
              </View>
            ))}

            {/* Total Points Row */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total Points</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{totalPoints}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20, display: "flex",
            flexDirection: "row", marginBottom: 20 }}>
          <Text>Prepared by:</Text>
          <View style={{ textAlign: "center", width: "45%" }}>
            <Text style={{ textDecoration: "underline", fontWeight: "bold" }}>
              {data.name}
            </Text>
            <Text>Signature over Printed Name</Text>
          </View>
        </View>

        <Text style={{marginBottom: 20}}>Evaluated by:</Text>
        <View style={{ marginBottom: 20, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ textDecoration: "underline" }}>___________________________________</Text>
            <Text>Research Innovation College Coordinator</Text>
          </View>

          <View style={{ textAlign: "center", width: "45%" }}>
            <Text style={{ textDecoration: "underline" }}>_____________</Text>
            <Text>Date Signed</Text>
          </View>
        </View>
        <View style={{ marginBottom: 20, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ textDecoration: "underline" }}>____________________________________________</Text>
            <Text>Executive Director, Office of Research and Innovation</Text>
          </View>

          <View style={{ textAlign: "center", width: "45%" }}>
            <Text style={{ textDecoration: "underline" }}>_____________</Text>
            <Text>Date Signed</Text>
          </View>
        </View>

        <Text style={{marginBottom: 20}}>Concurred by:</Text>
        <View style={{ marginBottom: 20, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ textDecoration: "underline" }}>___________________________________________________</Text>
            <Text>Vice President, Office of Research, Innovation and Extension</Text>
          </View>

          <View style={{ textAlign: "center", width: "45%" }}>
            <Text style={{ textDecoration: "underline" }}>_____________</Text>
            <Text>Date Signed</Text>
          </View>
        </View>


        <Text style={{marginBottom: 20}}>-----------------------------------------------------------------------------------------------------------------------------------------------------</Text>

        <Text style={{marginBottom: 20, fontWeight: "bold"}}>I confirm the above-stated total points and descriptive rating. I understand that these points will be used in calculating my research involvement in the FPES.</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <View style={{ textAlign: "center", width: "45%" }}>
            <Text style={{ textDecoration: "underline", fontWeight: "bold" }}>
              {data.name}
            </Text>
            <Text>Signature over Printed Name</Text>
          </View>

          <View style={{ textAlign: "center", width: "45%" }}>
            <Text style={{ textDecoration: "underline" }}>_____________</Text>
            <Text>Date Signed</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default FPESReport;