import { useState } from "react";
import { imagePlaceholder } from "../../../../assets/images";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

type EventType = React.ChangeEvent<HTMLInputElement>;

interface SDGType {
  name: string;
  description: string;
  image_path: string;
}

export default function AddAgendaMapping() {
  const [SDG, setSDG] = useState<SDGType>({
    name: "",
    description: "",
    image_path: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    imagePlaceholder,
  );
  const navigate = useNavigate();

  const handleOnChange = (e: EventType) => {
    const { name, value } = e.target;
    setSDG((prevData) => ({ ...prevData, [name]: value }));
  };

  const fileUpload = async (e: EventType) => {
    const { files } = e.target;
    setSelectedImage(files ? URL.createObjectURL(files[0]) : undefined);

    if (!files || !files[0]) return;
    const imageData = new FormData();
    imageData.append("image_path", files[0]);

    try {
      const response = await axios.post("/api/file-upload-public", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imagePath =
        response.data.data.image_path || response.data?.data?.image_path;
      setSDG((prevData) => ({ ...prevData, image_path: imagePath }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("/api/agendamapping", SDG);

      setSelectedImage(imagePlaceholder);
      setSDG({
        name: "",
        description: "",
        image_path: "",
      });
      navigate("/admin-settings/agenda-mapping");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-2/3 flex-col justify-center gap-5 rounded-md bg-white p-10 shadow-custom"
    >
      <h1>New Agenda Mapping</h1>

      <img
        src={selectedImage}
        width={250}
        height={250}
        alt="Image Placeholder"
        className="mx-auto"
      />

      <input
        onChange={handleOnChange}
        name="name"
        value={SDG.name}
        type="text"
        placeholder="Agenda name"
        className="rounded-md border-2 border-slate-700 p-2"
      />
      <input
        onChange={handleOnChange}
        name="description"
        value={SDG.description}
        type="text"
        placeholder="Agenda description"
        className="rounded-md border-2 border-slate-700 p-2"
      />
      <input type="file" onChange={fileUpload} />
      <button
        type="submit"
        className="rounded-md bg-blue-700 p-2 text-white hover:bg-blue-600"
      >
        Add New Agenda
      </button>
    </form>
  );
}
