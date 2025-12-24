"use client";

import React, { useState } from "react";
import axios from "@/lib/axios";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useToast } from "@/context/ToastContext";

export default function UserPasswordCard() {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      addToast("New passwords do not match", "error");
      return;
    }

    setIsSaving(true);
    try {
      await axios.put("/api/profile/password", formData);
      addToast("Password updated successfully", "success");
      setFormData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update password";
      addToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
        Update Password
      </h4>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="col-span-1 lg:col-span-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={formData.current_password}
              onChange={(e) => handleInputChange("current_password", e.target.value)}
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={isSaving}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
