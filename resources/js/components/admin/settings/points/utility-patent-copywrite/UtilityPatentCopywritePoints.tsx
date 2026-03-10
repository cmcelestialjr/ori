import { useEffect, useRef, useState } from "react";
import api from "../../../../api/axios";
import { AiFillEdit } from "react-icons/ai";
import UpdatePointsModal from "../components/UpdatePointsModal";

type UtilityPatentCopywritePointsType = {
  id: number;
  inclusion: string;
  points: number;
  status: string | null;
}[];

const UtilityPatentCopywritePoints = () => {
  const [data, setData] = useState<UtilityPatentCopywritePointsType>([]);
  const [refetch, setRefetch] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [points, setPoints] = useState(0);
  const selectedResearch = useRef<number | null>(null);
  const refetchData = () => {
    setRefetch(!refetch);
  };
  useEffect(() => {
    const controller = new AbortController();

    const getCurrentPoints = async () => {
      try {
        const res = await api.get("/api/utility-patent/points", {
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
    await api.put(`/api/utlity-patent/points/${selectedResearch.current}`, {
      points: points,
    });

    refetchData();
  };
  return (
    <>
      <h1 className="text-1xl text-gray-900">
        Utility/Patent/Copywrite Points
      </h1>
      <hr className="my-5 h-1 w-1/2 bg-gray-500" />
      <table className="w-full overflow-clip text-left text-sm text-gray-900 rtl:text-right">
        <thead className="relative bg-gray-50 font-sans text-sm text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Inclusion
            </th>
            <th scope="col" className="px-6 py-3">
              Points
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, i) => (
            <tr key={i} className="border-b bg-white hover:bg-gray-100">
              <td className="px-6 py-3">{item.inclusion}</td>
              <td className="px-6 py-3">{item.points}</td>
              <td className="px-6 py-3">{item.status ? item.status : "-"}</td>
              <td className="px-6 py-3">
                <button
                  onClick={() => {
                    setOpenModal(true);
                    selectedResearch.current = item.id;
                    setPoints(item.points);
                  }}
                  className="cursor-pointer rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700"
                >
                  <AiFillEdit size={20} />
                </button>
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
        }}
        message="Update Points"
        points={points}
        setPoints={setPoints}
        isOpen={openModal}
      />
    </>
  );
};

export default UtilityPatentCopywritePoints;
