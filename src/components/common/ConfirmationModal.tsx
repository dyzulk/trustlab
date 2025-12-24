"use client";

import React from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { AlertIcon } from "@/icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  requiredInput?: string; // Text that must be entered to enable the confirm button
  requiredInputPlaceholder?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  requiredInput,
  requiredInputPlaceholder = "Type to confirm...",
}) => {
  const [inputValue, setInputValue] = React.useState("");

  // Reset input when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  const isConfirmDisabled = isLoading || (requiredInput !== undefined && inputValue !== requiredInput);

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-error-50 dark:bg-error-500/10",
          iconColor: "text-error-600 dark:text-error-500",
          confirmBtn: "primary", // Assuming Button variant
          confirmBtnClass: "bg-error-600 hover:bg-error-700 text-white border-none",
        };
      case "warning":
        return {
          iconBg: "bg-warning-50 dark:bg-warning-500/10",
          iconColor: "text-warning-600 dark:text-warning-500",
          confirmBtn: "primary",
          confirmBtnClass: "bg-warning-600 hover:bg-warning-700 text-white border-none",
        };
      default:
        return {
          iconBg: "bg-brand-50 dark:bg-brand-500/10",
          iconColor: "text-brand-600 dark:text-brand-500",
          confirmBtn: "primary",
          confirmBtnClass: "",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[440px]" showCloseButton={true}>
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${styles.iconBg}`}>
            <AlertIcon className={`h-7 w-7 ${styles.iconColor}`} />
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          
          <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>

          {requiredInput !== undefined && (
            <div className="mb-6 w-full text-left">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Type <span className="text-gray-800 dark:text-white font-bold">"{requiredInput}"</span> to confirm
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-hidden transition focus:border-brand-500 dark:border-gray-800 dark:text-white"
                placeholder={requiredInputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
            </div>
          )}
          
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              className="w-full sm:flex-1"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              className={`w-full sm:flex-1 ${styles.confirmBtnClass}`}
              onClick={onConfirm}
              loading={isLoading}
              disabled={isConfirmDisabled}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
