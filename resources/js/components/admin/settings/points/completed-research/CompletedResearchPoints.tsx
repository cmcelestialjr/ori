import React, { useEffect, useRef, useState } from "react";
import api from "../../../../api/axios";
import Button from "../../../../shared/components/Button";
import Tooltip from "../../../../shared/components/Tooltip";
import { CiCircleQuestion } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CompletedResearchPoints = () => {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const data = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const getCurrentPoints = async () => {
      try {
        const res = await api.get("/api/completed/points", {
          signal: controller.signal,
        });
        setPoints(res.data.data.points);
        data.current = res.data.data.points;
      } catch (err) {
        console.error(err);
      }
    };

    getCurrentPoints();

    return () => controller.abort();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      await api.put("/api/completed/update-points", { points: points });
      data.current = points;
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="text-1xl text-gray-900">Completed Research Points</h1>
      <hr className="my-5 h-1 w-1/2 bg-gray-500" />
      <form onSubmit={handleSubmit}>
        <label htmlFor="points" className="text-md relative text-gray-900">
          Current Completed Points:{" "}
          <input
            value={points as number}
            className={` ${points !== data.current ? "border-blue-500 outline-blue-500" : "border-green-500 outline-green-500"} ms-1 rounded-md border-2 px-1 py-2`}
            onChange={(e) => setPoints(Number(e.target.value))}
            type="number"
            min="0"
            step="0.01"
          />
          <div className="absolute right-6 top-0">
            <Tooltip text="To be prorated among authors.">
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
        </label>
        <div className="flex w-full justify-end">
          <Button
            className="text-md mt-2 rounded-md bg-blue-500 px-3 py-2 font-semibold text-white disabled:cursor-not-allowed"
            type="submit"
            isDisabled={points === data.current || loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin transition-all duration-300" />
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CompletedResearchPoints;
