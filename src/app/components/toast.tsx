import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import "./styles.css";
import { twMerge } from "tailwind-merge";
export interface ToastMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  type: "error" | "success";
}

export default function ToastMessage({
  open,
  onOpenChange,
  title,
  description,
  type,
}: ToastMessageProps) {
  console.log("🚀 ~ type:", type);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={twMerge(
          `ToastRoot border-2`,
          type === "success" ? "border-green-400" : "border-red-400"
        )}
        open={open}
        onOpenChange={onOpenChange}
      >
        <Toast.Title className="ToastTitle">{title}</Toast.Title>

        <Toast.Description asChild>{description}</Toast.Description>

        <Toast.Action className="ToastAction" asChild altText="undo">
          <button
            className={twMerge(
              "Button small bg-white cursor-pointer",
              type === "success"
                ? "shadow-inset shadow-green-600 text-green-600"
                : "shadow-inset shadow-red-400 text-red-400",
              "shadow-inset"
            )}
          >
            Fechar
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
}
