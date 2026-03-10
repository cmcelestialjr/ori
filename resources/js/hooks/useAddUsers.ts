import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../components/api/axios";
import axios from "axios";
import { SubmitHandler, UseFormSetError } from "react-hook-form";
import { User } from "../components/shared/types/types";
import { UseFormType } from "../components/admin/users/faculty/AddFaculty";
import { toast } from "react-toastify";

export default function useAddUsers(
  apiUrl: string,
  navigateTo: string,
  setError: UseFormSetError<UseFormType>,
) {
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState("");
  const queryClient = useQueryClient();
  // **Mutation for file upload**
  const fileUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formImage = new FormData();
      formImage.append("image_path", file);
      const res = await api.post("/api/file-upload-public", formImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data?.image_path;
    },
    onSuccess: (path) => {
      setImagePath(path);
    },
    onError: (error) => {
      console.error("File upload error:", error);
    },
  });

  const userMutation = useMutation({
    mutationFn: async (form: Omit<User, "id">) => {
      return await api.post(apiUrl, form);
    },
    onSuccess: () => {
      navigate(navigateTo);
      toast.success("User added successfully")
    },
    onError: (error: UseFormType) => {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([key, messages]) => {
            setError(key as keyof UseFormType, {
              type: "manual",
              message: Array.isArray(messages) ? messages[0] : messages,
            });
          },
        );
      }
    },
  });

  const fileUpload = async (e: { target: { files?: FileList | null } }) => {
    if (e.target.files && e.target.files[0]) {
      fileUploadMutation.mutate(e.target.files[0]);
    }
  };

  const onSubmit: SubmitHandler<Omit<User, "id">> = async (data) => {
    const form = { ...data, image_path: imagePath || data.image_path };
    userMutation.mutate(form);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return {
    loading: userMutation.isLoading || fileUploadMutation.isLoading,
    fileUpload,
    onSubmit,
  };
}
