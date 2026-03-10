import { Link } from "react-router-dom";
import useGetResearches from "./hooks/useGetResearches";
import { parseDate } from "../util/parseDate";
import Pagination from "../shared/components/Pagination";
import { useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

const FacultyResearch = () => {
  const { data, loading, setParams } = useGetResearches();
  const ref = useRef<HTMLInputElement | null>(null);

  const handlePageChange = (pageNum: number) => {
    setParams((prev) => ({ ...prev, page: pageNum }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setParams((prev) => ({ ...prev, search: ref.current?.value as string }));
  };

  return (
    <section className="mx-auto grid max-w-7xl auto-cols-[minmax(0,2fr)] gap-5">
      <h1 className="text-2xl font-semibold">Research Production</h1>

      <div className="flex flex-col-reverse justify-end gap-5 pt-10 md:flex md:flex-row md:items-center">
        <Link
          to="/create/research"
          className="text-md rounded-lg bg-blue-900 px-2 py-2.5 text-center font-semibold text-white"
        >
          Save new research
        </Link>
        <form onSubmit={handleSearch}>
          <div className="flex items-center">
            <input
              type="search"
              placeholder="Search for..."
              className="w-full rounded-l-md border-2 border-r-0 border-slate-400 p-[6px] pl-5 text-base focus:outline-none md:w-[16rem]"
              ref={ref}
            />
            <button type="submit">
              <IoSearch
                size={40}
                className="rounded-r-md bg-blue-700 p-[px] text-white"
              />
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-scroll rounded-md bg-white p-5 shadow-custom">
        <div className="rounded-md border-2 border-gray-100">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="relative bg-gray-50 font-sans text-sm text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Research Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Authorship Nature
                </th>
                <th scope="col" className="px-6 py-3">
                  Authors
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Date Submitted
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
              {loading && (
                <div className="absolute bottom-0 h-1 w-20 animate-loading rounded-sm bg-blue-500"></div>
              )}
            </thead>
            <tbody>
              {data?.data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b bg-white hover:bg-gray-100"
                >
                  <td className="px-6 py-3">
                    <Link to={`/faculty/research/${item.id}`}>
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{item.authorship_nature}</td>
                  <td className="px-6 py-3">{item.authors}</td>
                  <td className="px-6 py-3">
                    {item.completed
                      ? "completed"
                      : item.published
                        ? "published"
                        : "ongoing"}
                  </td>
                  <td className="px-6 py-3">{parseDate(item.created_at)}</td>
                  <td className="cursor-pointer px-6 py-3">
                    <BsThreeDotsVertical />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ref.current?.value && data.data.length < 1 && (
            <p className="mt-5 pb-5 text-center text-sm text-gray-800">
              No results for '{ref.current?.value}'
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <Pagination
          currentPage={data?.paginationData.current_page}
          onPageChange={handlePageChange}
          totalPages={data.paginationData.last_page}
          links={data.paginationData.links}
        />
      </div>
    </section>
  );
};

export default FacultyResearch;
