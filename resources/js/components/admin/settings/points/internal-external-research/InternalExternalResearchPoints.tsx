import React, { useState, useRef, useEffect } from "react";
import api from "../../../../api/axios";
import UpdatePointsModal from "../components/UpdatePointsModal";

type DataType = {
  id: number;
  research_involvement: string;
  legend: string;
  points: number;
  ceiling_points: number | null;
  ceiling_points_legend: string | null;
}[];

const InternalExternalResearchPoints = () => {
  const [data, setData] = useState<DataType>([]);
  const [openModal, setOpenModal] = useState(false);
  const [points, setPoints] = useState(0);
  const selectedResearch = useRef<number | null>(null);
  const [refetch, setRefetch] = useState(false);
  const selectedPoints = useRef({
    points: false,
    ceiling_points: false,
  });

  const refetchData = () => {
    setRefetch(!refetch);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await api.get("/api/internal-external-points", {
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
    let formData;

    if (selectedPoints.current.ceiling_points) {
      formData = { ceiling_points: points };
    } else {
      formData = { points: points };
    }

    await api.put(`/api/internal-external-points/${selectedResearch.current}`, {
      formData,
    });

    selectedPoints.current.ceiling_points = false;
    selectedPoints.current.points = false;

    formData = {};

    refetchData();
  };
  return (
    <>
      <h1 className="text-1xl text-gray-900">
        Internal and External Funded Research Points
      </h1>
      <hr className="my-5 h-1 w-1/2 bg-gray-500" />
      <table className="w-full overflow-clip text-left text-sm text-gray-900 rtl:text-right">
        <thead className="relative bg-gray-50 font-sans text-sm text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Research Involvement
            </th>
            <th scope="col" className="px-6 py-3">
              Points
            </th>
            <th scope="col" className="px-6 py-3">
              Legend
            </th>
            <th scope="col" className="px-6 py-3">
              Ceiling Points
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
                  setPoints(item.points);
                  selectedPoints.current.points = true;
                }}
              >
                {item.points}
              </td>
              <td className="px-6 py-3">{item.legend}</td>
              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.ceiling_points ? item.ceiling_points : 0);
                  selectedPoints.current.ceiling_points = true;
                }}
              >
                {item.ceiling_points
                  ? item.ceiling_points + " " + item.ceiling_points_legend
                  : "-"}
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
          selectedPoints.current.ceiling_points = false;
          selectedPoints.current.points = false;
        }}
        message="Update Published Research Points"
        points={points}
        setPoints={setPoints}
        isOpen={openModal}
      />
    </>
  );
};

export default InternalExternalResearchPoints;
