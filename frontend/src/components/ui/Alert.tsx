import type { AlertType } from "app-ui";
import { useEffect, useState } from "react";

interface AlertProps {
  alert: AlertType;
  setAlert: React.Dispatch<React.SetStateAction<AlertType | undefined>>;
}

const Alert = ({ alert, setAlert }: AlertProps) => {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>(
    alert.messages.map((_, i) => i)
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    alert.messages.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleIndexes((prev) => prev.filter((i) => i !== index));
      }, index * 7000); // message i disappears after i * 1s

      timers.push(timer);
    });

    const cleanup = setTimeout(() => {
      setAlert(undefined);
    }, (alert.messages.length + 1) * 5000); // one second after the last disappears

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(cleanup);
    };
  }, [alert, setAlert]);

  if (visibleIndexes.length === 0) return null;

  return (
    <ul
      className="space-y-1 flex flex-col fixed top-4 right-4 z-50"
      role="alert"
    >
      {visibleIndexes.map((index) => (
        <li
          key={index}
          className={`py-1 px-3 rounded-md w-fit text-sm shadow-md ${
            alert.success
              ? "bg-green-100 text-green-900"
              : "bg-rose-100 text-rose-900"
          }`}
        >
          {alert.messages[index]}
        </li>
      ))}
    </ul>
  );
};

export default Alert;
