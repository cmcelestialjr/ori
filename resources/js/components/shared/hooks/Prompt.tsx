import * as React from "react";
import { useBeforeUnload, useBlocker } from "react-router-dom";

function usePrompt(
  message: string,
  when: boolean,
  beforeUnload: boolean,
  onConfirm: () => void,
) {
  const blocker = useBlocker(
    React.useCallback(() => {
      if (!when) return false;
      if (!window.confirm(message) && when) {
        onConfirm();
        return false;
      }
      return true;
    }, [when]),
  );

  React.useEffect(() => {
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker]);

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (beforeUnload) {
          event.preventDefault();
          return message;
        }
      },
      [message, beforeUnload],
    ),
    { capture: true },
  );
}

export function Prompt({
  when,
  message,
  onConfirm,
}: {
  when: boolean;
  message: string;
  onConfirm: () => void;
}) {
  usePrompt(message, when, true, onConfirm);
  return null;
}
