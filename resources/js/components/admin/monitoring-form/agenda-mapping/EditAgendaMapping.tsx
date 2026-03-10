import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { imagePlaceholder } from "../../../../assets/images";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";

type EventType = React.ChangeEvent<HTMLInputElement>;

interface AgendaType {
  name: string;
  image_path: string;
}

// --- Helper to fix broken URLs ---
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return imagePlaceholder;
  if (path.startsWith("http://localhost/storage")) {
    return path.replace("http://localhost/", "http://localhost:8000/");
  }
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/storage/${path}`;
};
// -------------------------------------------------------------

export default function EditAgendaMapping() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [initialAgenda, setInitialAgenda] = useState<AgendaType | null>(null);
  const [agenda, setAgenda] = useState<AgendaType>({
    name: "",
    image_path: "",
  });

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    imagePlaceholder,
  );
  const [loading, setLoading] = useState(true);

  const hasChanges =
    initialAgenda &&
    (agenda.name !== initialAgenda.name ||
      agenda.image_path !== initialAgenda.image_path);

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const response = await axios.get(`/api/agendamapping/${id}`);
        const data = response.data.data || response.data;

        const payload = {
          name: data.name,
          image_path: data.image_path,
        };

        setInitialAgenda(payload);
        setAgenda(payload);
        setSelectedImage(getImageUrl(data.image_path));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch Agenda details:", error);
        toast.error("Could not load Agenda details.");
        navigate("/admin-settings/agenda-mapping");
      }
    };

    if (id) fetchAgenda();
  }, [id, navigate]);

  const handleOnChange = (e: EventType) => {
    const { name, value } = e.target;
    setAgenda((prev) => ({ ...prev, [name]: value }));
  };

  const fileUpload = async (e: EventType) => {
    const { files } = e.target;
    setSelectedImage(files && files[0] ? URL.createObjectURL(files[0]) : undefined);

    if (!files || !files[0]) return;

    const imageData = new FormData();
    imageData.append("image_path", files[0]);

    try {
      const response = await axios.post("/api/file-upload-public", imageData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imagePath = response.data.image_path || response.data?.data?.image_path;
      setAgenda((prev) => ({ ...prev, image_path: imagePath }));
    } catch (error) {
      console.error("File upload failed: ", error);
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`/api/agendamapping/${id}`, agenda);
      toast.success("Agenda updated successfully.");
      setInitialAgenda({ ...agenda });
      navigate("/admin-settings/agenda-mapping");
    } catch (error) {
      console.error("Failed to update Agenda: ", error);
      toast.error("Failed to update Agenda. Please try again.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Agenda details...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-2/3 flex-col gap-5 rounded-md bg-white p-10 shadow-custom"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Edit Agenda Mapping</h1>
        <button
            type="button"
            onClick={() => navigate("/admin-settings/agenda-mapping")}
            className="text-sm text-gray-500 hover:text-gray-700"
        >
            Cancel
        </button>
      </div>

      <img
        src={selectedImage}
        width={250}
        height={250}
        alt="Preview"
        className="mx-auto object-contain rounded-md border"
      />

      <label className="font-semibold text-sm text-gray-600">Name</label>
      <input
        onChange={handleOnChange}
        name="name"
        value={agenda.name}
        type="text"
        placeholder="Agenda name"
        className="rounded-md border-2 border-slate-700 p-2"
        required
      />

      <label className="font-semibold text-sm text-gray-600">Change Image</label>
      <input type="file" onChange={fileUpload} accept="image/*" />

      <button
        type="submit"
        disabled={!hasChanges}
        className="mt-4 rounded-md bg-green-700 p-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Update Agenda
      </button>
    </form>
  );
}