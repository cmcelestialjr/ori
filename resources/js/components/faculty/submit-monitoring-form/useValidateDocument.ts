import { useMutation } from "@tanstack/react-query";
import api from "../../api/axios";

const validateDocument = async ({
  filePath,
  fileLabel,
  involvementType,
}: {
  filePath: string;
  fileLabel: string;
  involvementType: number;
}) => {
  const res = await api.post("/api/validate-document", {
    file_path: filePath,
    type: fileLabel,
    involvement_type: involvementType,
  });
  return res.data.data;
};

export function useValidateDocument() {
  return useMutation({
    mutationFn: validateDocument,
    retry: false,
  });
}
