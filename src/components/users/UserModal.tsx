"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { User as UserIcon, Mail, Lock, Shield, Phone, Info } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  user?: any; // If provided, we are in Edit mode
  isLoading?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "", // Never pre-fill password
        role: user.role === 'user' ? 'customer' : (user.role || "customer"),
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "customer",
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!user && !formData.password) {
      newErrors.password = "Password is required for new users";
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {user ? "Edit User" : "Add New User"}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">First Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className={`w-full pl-10 pr-4 py-2.5 text-sm border ${errors.first_name ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl bg-transparent focus:ring-2 focus:ring-brand-500/10 outline-none transition-all dark:text-white/90 dark:placeholder:text-white/30`}
              />
            </div>
            {errors.first_name && <p className="text-[10px] text-red-500 font-medium">{errors.first_name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:ring-2 focus:ring-brand-500/10 outline-none transition-all dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full pl-10 pr-4 py-2.5 text-sm border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl bg-transparent focus:ring-2 focus:ring-brand-500/10 outline-none transition-all dark:text-white/90 dark:placeholder:text-white/30`}
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {user ? "New Password (Leave blank to keep current)" : "Password"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 text-sm border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl bg-transparent focus:ring-2 focus:ring-brand-500/10 outline-none transition-all dark:text-white/90 dark:placeholder:text-white/30`}
            />
          </div>
          {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">User Role</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Shield className="w-4 h-4" />
            </span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-transparent focus:ring-2 focus:ring-brand-500/10 outline-none transition-all appearance-none dark:bg-gray-900 dark:text-white/90"
            >
              <option value="customer" className="dark:bg-gray-900">Customer (Standard Access)</option>
              <option value="admin" className="dark:bg-gray-900">Admin (Full Access)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 rounded-xl"
            loading={isLoading}
          >
            {user ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
