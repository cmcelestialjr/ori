import React, { useState, useRef, useEffect } from "react";
import api from "../../../../api/axios";
import UpdatePointsModal from "../components/UpdatePointsModal";

type PeerReviewDataType = {
  id: number;
  article_points: number;
  abstract_points: number;
  coverage: string;
}[];

const PeerReviewPoints = () => {
  const [data, setData] = useState<PeerReviewDataType>([]);
  const [openModal, setOpenModal] = useState(false);
  const [points, setPoints] = useState(0);
  const selectedResearch = useRef<number | null>(null);
  const [refetch, setRefetch] = useState(false);
  const selectedPoints = useRef({
    abstract_points: false,
    article_points: false,
  });

  const refetchData = () => {
    setRefetch(!refetch);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await api.get("/api/peer-review/points", {
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

    if (selectedPoints.current.abstract_points) {
      formData = { abstract_points: points };
    } else {
      formData = { article_points: points };
    }

    await api.put(`/api/peer-review/${selectedResearch.current}/update-points`, {
      formData,
    });

    selectedPoints.current.abstract_points = false;
    selectedPoints.current.article_points = false;

    formData = {};

    refetchData();
  };
  return (
    <>
      <h1 className="text-1xl text-gray-900">
        Refeering in Peer-Review Journal Points
      </h1>
      <hr className="my-5 h-1 w-1/2 bg-gray-500" />
      <table className="w-full overflow-clip text-left text-sm text-gray-900 rtl:text-right">
        <thead className="relative bg-gray-50 font-sans text-sm text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Coverage
            </th>
            <th scope="col" className="px-6 py-3">
              Points per Abstract
            </th>
            <th scope="col" className="px-6 py-3">
              Points per Article
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, i) => (
            <tr key={i} className="border-b bg-white hover:bg-gray-100">
              <td className="px-6 py-3">{item.coverage}</td>
              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.abstract_points);
                  selectedPoints.current.abstract_points = true;
                }}
              >
                {item.abstract_points}
              </td>
              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.article_points);
                  selectedPoints.current.article_points = true;
                }}
              >
                {item.article_points}
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
          selectedPoints.current.abstract_points = false;
          selectedPoints.current.article_points = false;
        }}
        message="Update Published Research Points"
        points={points}
        setPoints={setPoints}
        isOpen={openModal}
      />
    </>
  );
};

export default PeerReviewPoints;
