import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingIndicatorProps {
  isLoading: boolean;
  text: string | string[];
  delay?: number;
}

const LoadingSpinner = ({
  isLoading,
  text,
  delay = 2000,
}: LoadingIndicatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isLoading || !Array.isArray(text) || text.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % text.length);
    }, delay);

    return () => clearInterval(intervalId);
  }, [isLoading, text, delay]);

  useEffect(() => {
    if (!isLoading) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  const displayText = Array.isArray(text) ? text[currentIndex] : text;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm backdrop-brightness-50 backdrop-saturate-50">
      <div className="flex flex-col items-center">
        <AiOutlineLoading3Quarters className="size-16 animate-spin text-white" />
        {displayText && <p className="text-lg text-white">{displayText}</p>}
      </div>
    </div>,
    document.body
  );
};

export default LoadingSpinner;
