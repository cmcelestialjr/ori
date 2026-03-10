type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  isDisabled?: boolean;
  className: string;
  type: "submit" | "button" | "reset";
};

const Button = ({
  children,
  onClick,
  isDisabled,
  className,
  type,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
