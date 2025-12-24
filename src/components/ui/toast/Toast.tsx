"use client";

import React from "react";
import { useToast, ToastMessage, ToastType } from "@/context/ToastContext";
import {
  CheckCircleIcon,
  ErrorIcon,
  AlertIcon,
  InfoIcon,
  CloseIcon,
} from "@/icons";

const Toast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const { removeToast } = useToast();

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    error: <ErrorIcon className="w-5 h-5 text-red-500" />,
    warning: <AlertIcon className="w-5 h-5 text-yellow-500" />,
    info: <InfoIcon className="w-5 h-5 text-blue-500" />,
  };

  const bgClasses = {
    success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
  };

  return (
    <div
      className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 rounded-lg shadow-lg border transition-all duration-300 animate-slide-in ${bgClasses[toast.type]}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        {icons[toast.type]}
      </div>
      <div className="ms-3 text-sm font-normal text-gray-800 dark:text-gray-200">
        {toast.message}
      </div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={() => removeToast(toast.id)}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[999999] flex flex-col items-end pointer-events-none w-full max-w-xs">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full transition-all duration-500 ease-in-out">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
};
