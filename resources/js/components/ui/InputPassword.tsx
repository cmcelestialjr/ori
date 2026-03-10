import { ChangeEvent, useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  required: boolean;
}

export const InputPassword = ({
  value,
  onChange,
  placeholder = "Password",
  id = "password",
  name = "password",
  required = false,
}: PasswordInputProps) => {
  
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        autoComplete="current-password"
        required={required}
        className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500"
      >
        {showPassword ? (
          <VscEye className="h-5 w-5" />
        ) : (
          <VscEyeClosed className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
