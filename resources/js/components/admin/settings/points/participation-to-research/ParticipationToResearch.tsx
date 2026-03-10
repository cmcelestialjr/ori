import React, { useEffect, useState } from "react";
import { type TableType } from "./constants";
import api from "../../../../api/axios";
import ParticipationTable from "./ParticipationTable";
import { IoSearch } from "react-icons/io5";

const ParticipationToResearch = () => {
  const [data, setData] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<TableType[]>([]);
  const [selectedResearch, setSelectedResearch] = useState<number | null>(null);
  const [points, setPoints] = useState(0);
  const [refetch, setRefetch] = useState(false);

  const refetchData = () => {
    setRefetch(!refetch);
  };

  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/participation-to-research", {
          signal: controller.signal,
        });

        setData(res.data.data);
        setFilteredData(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getData();

    return () => controller.abort();
  }, [refetch]);

  useEffect(() => {
    if (!data) return;

    setFilteredData(data);
  }, [data]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = data.filter(
      (item) =>
        item.category.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.coverage.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.legend.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const handleUpdate = async () => {
    const record = data.find((item) => item.id === selectedResearch);

    const formData = {
      attendance_nature: record?.category,
      coverage: record?.coverage,
      points: points,
    };

    await api.put(
      `api/participation-to-research/${selectedResearch}/update`,
      formData,
    );

    setPoints(0);
    refetchData();
  };

  return (
    <>
      <h1 className="text-1xl text-gray-900">
        Participation to Research/Seminar/Activity Points
      </h1>
      <hr className="my-5 h-1 w-1/2 bg-gray-500" />
      <div className="my-4 flex justify-end space-x-10">
        <div className="flex items-center">
          <input
            type="search"
            onChange={handleSearch}
            placeholder={"Search for..."}
            className="w-[16rem] rounded-l-md border-2 border-r-0 border-slate-400 p-[6px] pl-5 text-base focus:outline-none"
          />
          <IoSearch
            size={40}
            className="rounded-r-md bg-blue-700 p-[px] text-white"
          />
        </div>
      </div>
      <ParticipationTable
        points={points}
        setPoints={setPoints}
        handleUpdate={handleUpdate}
        setSelectedResearch={setSelectedResearch}
        loading={loading}
        data={filteredData}
      />
    </>
  );
};

export default ParticipationToResearch;
