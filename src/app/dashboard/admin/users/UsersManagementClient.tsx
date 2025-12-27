"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { PlusIcon } from "@/icons";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/button/Button";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import UserModal from "@/components/users/UserModal";
import { Edit, Trash, MoreVertical, Shield, User as UserIcon, Mail, Calendar, Search } from "lucide-react";
import Image from "next/image";
import { getUserAvatar } from "@/lib/utils";
import PageLoader from "@/components/ui/PageLoader";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function UsersManagementClient() {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const { data, error, mutate, isLoading } = useSWR("/api/admin/users", fetcher);

  const isAdmin = currentUser?.role === "admin";

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/admin/users/${id}`);
      mutate();
      addToast("User deleted successfully", "success");
      setConfirmDeleteId(null);
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to delete user", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveUser = async (formData: any) => {
    setIsSaving(true);
    try {
      if (editingUser) {
        await axios.patch(`/api/admin/users/${editingUser.id}`, formData);
        addToast("User updated successfully", "success");
      } else {
        await axios.post("/api/admin/users", formData);
        addToast("User created successfully", "success");
      }
      mutate();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to save user", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (u: any) => {
    setEditingUser(u);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const users = data?.data || [];

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  if (error) return <div className="p-10 text-center text-error-500">Failed to load users.</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="User Management" />
      
      <div className="space-y-6">
        <ComponentCard 
          title="Users Dashboard" 
          desc="Manage system users, adjust roles, and monitor account activity"
          headerAction={
            <div className="flex items-center gap-3">
               <div className="relative hidden sm:block">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-500/10 outline-none w-64 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-transparent outline-none dark:bg-gray-900 dark:text-white/90"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="customer">Customers</option>
              </select>
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleAddClick}
              >
                <PlusIcon className="w-4 h-4" />
                Add User
              </Button>
            </div>
          }
        >
          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined Date</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={getUserAvatar(u)}
                              alt={`${u.first_name} ${u.last_name}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{u.first_name} {u.last_name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {u.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400' : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                          {u.role === 'customer' ? 'customer' : u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                         <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(u.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                         </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(u)}
                            className="p-2 text-gray-400 hover:text-brand-500 transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(u.id)}
                            className={`p-2 text-gray-400 hover:text-red-500 transition-colors ${currentUser?.id === u.id ? 'opacity-20 pointer-events-none' : ''}`}
                            title="Delete User"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400 italic">
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          
          {(isLoading || isDeleting) && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10 backdrop-blur-sm rounded-2xl">
              <PageLoader text="Processing..." className="h-full" />
            </div>
          )}
        </ComponentCard>
      </div>

      <ConfirmationModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account? This action cannot be undone and the user will lose all access to the platform."
        isLoading={isDeleting}
        confirmLabel="Delete User"
        requiredInput="DELETE"
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
        isLoading={isSaving}
      />
    </div>
  );
}
