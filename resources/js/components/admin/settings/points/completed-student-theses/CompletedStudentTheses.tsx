import { useState, useRef, useEffect } from "react";
import api from "../../../../api/axios";
import UpdatePointsModal from "../components/UpdatePointsModal";

type CompletedStudentThesesType = {
  id: number;
  research_involvement: string;
  undergraduate_points: number;
  graduate_points: number;
  dissertation: number;
}[];

const CompletedStudentTheses = () => {
  const [data, setData] = useState<CompletedStudentThesesType>([]);
  const [openModal, setOpenModal] = useState(false);
  const [points, setPoints] = useState(0);
  const selectedResearch = useRef<number | null>(null);
  const [refetch, setRefetch] = useState(false);
  const selectedPoints = useRef({
    undergraduate_points: false,
    graduate_points: false,
    dissertation: false,
  });

  const refetchData = () => {
    setRefetch(!refetch);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await api.get("/api/student-theses/points", {
          signal: controller.signal,
        });

        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [refetch]);

  const handleUpdate = async () => {
    let formData = {};

    if (selectedPoints.current.undergraduate_points) {
      formData = { undergraduate_points: points };
    } else if (selectedPoints.current.graduate_points) {
      formData = { graduate_points: points };
    } else {
      formData = { dissertation: points };
    }

    await api.put(
      `api/student-theses/${selectedResearch.current}/update-points`,
      {
        formData,
      },
    );
    selectedPoints.current.dissertation = false;
    selectedPoints.current.undergraduate_points = false;
    selectedPoints.current.graduate_points = false;

    formData = {};

    refetchData();
  };
  return (
    <>
      <h1 className="text-1xl text-gray-900">
        Involvement in Completed Student Theses
      </h1>
      <hr className="my-5 h-1 w-1/2 bg-gray-500" />
      <table className="w-full overflow-clip text-left text-sm text-gray-900 rtl:text-right">
        <thead className="relative bg-gray-50 font-sans text-sm text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Research Involvement
            </th>
            <th scope="col" className="px-6 py-3">
              Undergraduate
            </th>
            <th scope="col" className="px-6 py-3">
              Graduate
            </th>
            <th scope="col" className="px-6 py-3">
              Dissertation
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, i) => (
            <tr key={i} className="border-b bg-white hover:bg-gray-100">
              <td className="px-6 py-3">{item.research_involvement}</td>
              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.undergraduate_points);
                  selectedPoints.current.undergraduate_points = true;
                }}
              >
                {item.undergraduate_points}
              </td>
              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.graduate_points);
                  selectedPoints.current.graduate_points = true;
                }}
              >
                {item.graduate_points}
              </td>
              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.dissertation);
                  selectedPoints.current.dissertation = true;
                }}
              >
                {item.dissertation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdatePointsModal
        onConfirm={() => {
          setOpenModal(false);
          handleUpdate();
        }}
        onCancel={() => {
          setOpenModal(false);
          setPoints(0);
          selectedPoints.current.dissertation = false;
          selectedPoints.current.undergraduate_points = false;
          selectedPoints.current.graduate_points = false;
        }}
        message="Update Involvement in Completed Student Theses Points"
        points={points}
        setPoints={setPoints}
        isOpen={openModal}
      />
    </>
  );
};

export default CompletedStudentTheses;
