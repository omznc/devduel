"use client";

import { ToastBar, Toaster } from "react-hot-toast";
import { PiCheckCircleDuotone, PiXCircleDuotone } from "react-icons/pi";

const Toast = () => {
  return (
    // @apply border border-black border-opacity-25 dark:border-white dark:border-opacity-25;
    <Toaster
      position={"bottom-center"}
      reverseOrder={true}
      toastOptions={{
        className:
          "border-normal bg-colored after:bg-yellow-500 after:opacity-20 text-xl text-black dark:text-white bg-white dark:bg-black bg-opacity-10 dark:bg-opacity-10 backdrop-blur-lg",
        style: {
          borderRadius: "1rem",
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {t.type === "success" && (
                <PiCheckCircleDuotone className="text-green-500" />
              )}
              {t.type === "error" && (
                <PiXCircleDuotone className="text-red-500" />
              )}
              {t.type !== "success" && t.type !== "error" && icon}
              {message}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default Toast;
