import { useEffect, useRef, useState } from "react";
import api from "../../../api/axios";
import UpdatePointsModal from "../points/components/UpdatePointsModal";

type CitationDataType = {
  id: number;
  min_range_points: number;
  max_range_points: number;
  incentive: number;
}[];

const AwardsManagement = () => {
  const [data, setData] = useState<CitationDataType>([]);
  const [refetch, setRefetch] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [points, setPoints] = useState(0);
  const selectedResearch = useRef<number | null>(null);
  const selectedProperty = useRef({
    min_range_points: false,
    max_range_points: false,
    incentive: false,
  });
  const refetchData = () => {
    setRefetch(!refetch);
  };
  useEffect(() => {
    const controller = new AbortController();

    const getCurrentPoints = async () => {
      try {
        const res = await api.get("/api/awards", {
          signal: controller.signal,
        });
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    getCurrentPoints();

    return () => controller.abort();
  }, [refetch]);

  const handleUpdate = async () => {
    let formData;

    if (selectedProperty.current.min_range_points) {
      formData = { min_range_points: points };
    } else if (selectedProperty.current.max_range_points) {
      formData = { max_range_points: points };
    } else {
      formData = { incentive: points };
    }

    await api.put(`/api/awards/${selectedResearch.current}`, {
      formData,
    });

    selectedProperty.current.min_range_points = false;
    selectedProperty.current.max_range_points = false;
    selectedProperty.current.incentive = false;
    refetchData();
  };
  return (
    <>
      <h1 className="text-1xl text-gray-900">Awards Incentive</h1>
      <hr className="my-5 h-1 w-1/2 bg-gray-500" />
      <table className="w-full overflow-clip text-left text-sm text-gray-900 rtl:text-right">
        <thead className="relative bg-gray-50 font-sans text-sm text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Minimum Points
            </th>
            <th scope="col" className="px-6 py-3">
              Maximum Points
            </th>
            <th scope="col" className="px-6 py-3">
              Incentive
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, i) => (
            <tr key={i} className="border-b bg-white hover:bg-gray-100">
              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.min_range_points);
                  selectedProperty.current.min_range_points = true;
                }}
              >
                {item.min_range_points} - points
              </td>

              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.max_range_points);

                  selectedProperty.current.max_range_points = true;
                }}
              >
                {item.max_range_points
                  ? item.max_range_points + " points"
                  : "above"}
              </td>

              <td
                className="cursor-pointer px-6 py-3 hover:underline"
                onClick={() => {
                  setOpenModal(true);
                  selectedResearch.current = item.id;
                  setPoints(item.incentive);

                  selectedProperty.current.incentive = true;
                }}
              >
                Php {item.incentive.toFixed(2)}
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

          selectedProperty.current.min_range_points = false;
          selectedProperty.current.max_range_points = false;
          selectedProperty.current.incentive = false;
        }}
        message={
          points ===
          data.find((item) => item.id === selectedResearch.current)?.incentive
            ? "Update Award Incentive"
            : "Update Award Points"
        }
        points={points}
        label={
          points ===
          data.find((item) => item.id === selectedResearch.current)?.incentive
            ? "Enter new incentive"
            : "Enter new points"
        }
        setPoints={setPoints}
        isOpen={openModal}
      />
    </>
  );
};

export default AwardsManagement;
