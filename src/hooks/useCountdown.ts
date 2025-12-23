import { useEffect, useState } from "react";

/**
 * Countdown hook driven by backend seconds
 */
export const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;

    const id = setInterval(() => {
      setSeconds(s => Math.max(s - 1, 0));
    }, 1000);

    return () => clearInterval(id);
  }, [seconds]);

  return seconds;
};
