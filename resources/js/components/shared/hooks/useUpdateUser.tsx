import { useState } from "react";
import api from "../../api/axios";
import axios from "axios";
import { User } from "../types/types";

type dataType = Omit<User, "role">;

const useUpdateUser = (id: number, user: dataType) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateUser = async () => {
    setLoading(true);

    try {
      const response = await api.put(`/api/coordinators/${id}`, user);

      setImageUrl(response.data.data.image_path);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { imageUrl, loading, error, updateUser };
};

export default useUpdateUser;
