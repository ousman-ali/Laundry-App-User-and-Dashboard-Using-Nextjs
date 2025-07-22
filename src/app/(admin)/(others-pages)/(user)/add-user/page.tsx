"use client";

import React, { useState } from "react";

const rolePermissionsMap: Record<string, string[]> = {
  admin: ["Manage Users", "Manage Orders", "View Reports"],
  washer: ["View Assigned Orders", "Update Order Status"],
  customer: ["Create Orders", "Track Orders"],
};

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const [permissions, setPermissions] = useState<string[]>(rolePermissionsMap["customer"]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "role") {
      setPermissions(rolePermissionsMap[value] || []);
    }
  };

  const handleRemovePermission = (perm: string) => {
    setPermissions((prev) => prev.filter((p) => p !== perm));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission = { ...formData, permissions };
    console.log("Submitting user:", submission);
    // Send to API
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New User</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        id="addUserForm"
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Left: Form Fields */}
        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Right: Role + Permissions */}
        <div className="w-full md:w-1/3 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700"
            >
              <option value="admin">Admin</option>
              <option value="washer">Washer</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div>
            <h4 className="text-gray-700 dark:text-gray-200 mb-2 font-medium">Permissions:</h4>
            {permissions.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {permissions.map((perm, i) => (
                  <li
                    key={i}
                    className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {perm}
                    <button
                      type="button"
                      onClick={() => handleRemovePermission(perm)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No permissions selected.</p>
            )}
          </div>
        </div>
        
      </form>
      <div className="flex justify-end">
        <button
            type="submit"
            form="addUserForm"
            className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition"
            >
            Add User
        </button>
      </div>
    </div>
  );
}
