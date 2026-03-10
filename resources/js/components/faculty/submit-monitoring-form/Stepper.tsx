const Stepper = ({ step }: { step: number }) => {
  return (
    <ol className="flex items-center justify-center gap-x-4">
      <li>
        <hr
          className={`mb-3 w-64 rounded-sm border-4 ${step >= 1 ? "border-blue-800" : "border-gray-400"} `}
        />
        <span
          className={`tracking-wide ${step >= 1 ? "text-blue-800" : "text-gray-400"}`}
        >
          Research Involvement Type
        </span>
      </li>
      <li>
        <hr
          className={`mb-3 w-64 rounded-sm border-4 ${step >= 2 ? "border-blue-800" : "border-gray-400"} `}
        />
        <span
          className={`tracking-wide ${step >= 2 ? "text-blue-800" : "text-gray-400"}`}
        >
          SDG and Agenda
        </span>
      </li>
      <li>
        <hr
          className={`mb-3 w-64 rounded-sm border-4 ${step === 3 ? "border-blue-800" : "border-gray-400"} `}
        />
        <span
          className={`tracking-wide ${step === 3 ? "text-blue-800" : "text-gray-400"}`}
        >
          Details
        </span>
      </li>
    </ol>
  );
};

export default Stepper;
