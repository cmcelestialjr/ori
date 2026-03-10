import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { parseDate } from "../util/parseDate";
import pdfThumbnail from "../../assets/images/pngwing.com.png";
import useGetResearch from "./hooks/useGetResearch";
import Button from "../shared/components/Button";
import api from "../api/axios";
import axios from "axios";

const form = {
  title: "",
  authors: "",
  authorship_nature: "",
};

const FacultyResearchDetails = () => {
  const [formData, setFormData] = useState(form);
  const [updateLoading, setUpdateLoading] = useState(false);

  const { id } = useParams();
  const { data, loading } = useGetResearch(Number(id));

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setFormData({
        authors: data.authors,
        authorship_nature: data.authorship_nature,
        title: data.title,
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await api.put(`/api/research/${data?.id}`, formData);
      setUpdateLoading(false);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        <div className="text-red-500">{e.response?.data.message}</div>;
      }
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    setUpdateLoading(true);
    try {
      await api.delete(`/api/research/${id}`);

      setUpdateLoading(false);
      navigate("/faculty-research");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        <div className="text-red-500">{e.response?.data.message}</div>;
      }
    }
  };
  return (
    <>
      <section>
        <div className="container mx-auto mt-2 max-w-3xl bg-white px-10 py-5 shadow-sm">
          <h1 className="text-1xl font-semibold">Research Details</h1>
          <hr className="my-5 w-full border border-gray-500" />
          {loading ? (
            <div className="h-5 animate-bounce">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <label htmlFor="title" className="text-sm">
                <span className="font-semibold">Research Title</span>
                <input
                  id="title"
                  className="block w-full border-b border-b-green-500 px-3 py-1 focus:outline-none"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </label>
              <label htmlFor="authorship_nature" className="mt-3 text-sm">
                <span className="font-semibold">Authorship Nature</span>
                {data?.authorship_nature ? (
                  <p className="mt-1 block w-full cursor-text select-text border-b border-green-500 bg-white px-3 py-1 text-sm focus:outline-none">
                    {data?.authorship_nature}
                  </p>
                ) : (
                  <select
                    id="AuthorshipNature"
                    value={formData.authorship_nature}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        authorship_nature: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full cursor-pointer border-b border-green-500 bg-white px-3 py-1 text-sm focus:outline-none"
                  >
                    <option value="Sole Author">Sole Author</option>
                    <option value="Collaborative Local">
                      Collaborative Local (Within LNU from the same academic
                      unit)
                    </option>
                    <option value="Collaborative">
                      Collaborative (Within LNU form different academic unit)
                    </option>
                    <option value="Collaborative with outside LNU authors">
                      Collaborative with outside LNU authors
                    </option>
                  </select>
                )}
              </label>
              <label htmlFor="authors" className="mt-3 text-sm">
                <span className="font-semibold">Authors</span>
                <input
                  id="authors"
                  className="block w-full border-b border-b-green-500 px-3 py-1 focus:outline-none"
                  value={formData.authors}
                  readOnly={data?.authors ? true : false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      authors: e.target.value,
                    }))
                  }
                />
              </label>
              <label htmlFor="research_field" className="mt-3 text-sm">
                <span className="font-semibold">Research Field</span>
                <input
                  id="research_field"
                  className="block w-full border-b border-b-green-500 px-3 py-1 focus:outline-none"
                  value={data?.research_field.field}
                />
              </label>
              <label htmlFor="research_type" className="mt-3 text-sm">
                <span className="font-semibold">Research Type</span>
                <input
                  id="research_type"
                  className="block w-full border-b border-b-green-500 px-3 py-1 focus:outline-none"
                  value={data?.research_type.type}
                />
              </label>
              <label
                htmlFor="socio_economic_objective"
                className="mt-3 text-sm"
              >
                <span className="font-semibold">Socio Economic Objective</span>
                <input
                  className="block w-full border-b border-b-green-500 px-3 py-1 focus:outline-none"
                  value={data?.socio_economic_objective.type}
                />
              </label>
              <label className="mt-3 text-sm">
                <span className="font-semibold">Research Document</span>

                <a
                  href={data?.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-1/2"
                >
                  <img
                    src={pdfThumbnail}
                    width={150}
                    height={150}
                    className="mt-2 rounded-md border border-gray-300"
                    loading="lazy"
                  />
                </a>
              </label>
              <label htmlFor="completed" className="mt-3 text-sm">
                <span className="font-semibold">Completed</span>
                {!data?.completed ? (
                  <p className="mt-2 font-light tracking-wide">
                    This research has not been marked as completed yet.{" "}
                    <Link to="/create/research-monitoring-form">
                      <span className="text-blue-500 hover:underline">
                        Create and submit
                      </span>{" "}
                    </Link>{" "}
                    a Completed Research Production Monitoring Form, attached
                    this research then wait for evaluation.
                  </p>
                ) : (
                  <p className="block w-full border-b border-b-green-500 px-3 py-1 focus:outline-none">
                    {parseDate(data?.completed.date_completed)} -{" "}
                    <Link
                      to={`/faculty/research-monitoring-form/${data.completed.researchmonitoringform_id}`}
                      className="text-blue-500 hover:underline"
                    >
                      view submission here
                    </Link>
                  </p>
                )}
              </label>
              <label htmlFor="published" className="mt-3 text-sm">
                <span className="font-semibold">Published</span>
                {!data?.published ? (
                  <p className="mt-2 font-light tracking-wide">
                    This research has not been marked as Published yet.{" "}
                    <Link to="/create/research-monitoring-form">
                      <span className="text-blue-500 hover:underline">
                        Create and submit
                      </span>{" "}
                    </Link>{" "}
                    a Published Research Production Monitoring Form, attached
                    this research then wait for evaluation.
                  </p>
                ) : (
                  <p className="block w-full border-b border-b-green-500 px-3 py-1 focus:outline-none">
                    {parseDate(data?.published.date)} -{" "}
                    <Link
                      to={`/faculty/research-monitoring-form/${data.published.researchmonitoringform_id}`}
                      className="text-blue-500 hover:underline"
                    >
                      view submission here
                    </Link>
                  </p>
                )}
              </label>

              {!data?.completed ||
                (!data.published && (
                  <div className="div flex-row-reverse items-center justify-end space-x-3">
                    <Button
                      isDisabled={loading || updateLoading}
                      type="submit"
                      className="rounded-md bg-blue-500 px-5 py-2 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed"
                    >
                      Update
                    </Button>
                    <Button
                      isDisabled={loading || updateLoading}
                      type="button"
                      onClick={() =>
                        confirm(
                          "Are you sure you want to delete this research?",
                        )
                          ? handleDelete(data?.id)
                          : null
                      }
                      className="rounded-md bg-red-500 px-5 py-2 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default FacultyResearchDetails;
