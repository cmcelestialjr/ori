import { useState } from "react";
import api from "../../api/axios";
import axios from "axios";

const useFileUpload = () => {
  const [imagePath, setImagePath] = useState("");

  const fileUpload = async (image: FormData) => {
    try {
      const res = await api.post("/api/file-upload-public", image, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImagePath(res.data.data?.image_path);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.error(e.message);
      }
    }
  };
  return { imagePath, fileUpload };
};

export default useFileUpload;
