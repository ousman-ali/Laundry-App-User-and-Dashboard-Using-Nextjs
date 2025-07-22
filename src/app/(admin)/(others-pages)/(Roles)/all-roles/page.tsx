"use client";

import React from "react";
import Link from "next/link";

const roles = [
  { id: 1, name: "Admin", permissions: ["Manage Users", "Manage Orders"] },
  { id: 2, name: "Washer", permissions: ["View Orders"] },
  { id: 3, name: "Customer", permissions: ["Create Orders", "View Status"] },
];

export default function RolesTable() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-x-auto">
      {/* Header section with title and button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Roles List</h2>
        <Link href="/role-create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm">
            + Create New Role
            </button>
        </Link>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse text-left">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <th className="px-4 py-2 border-b">#</th>
            <th className="px-4 py-2 border-b">Role Name</th>
            <th className="px-4 py-2 border-b">Permissions</th>
            <th className="px-4 py-2 border-b text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-2 border-b text-gray-700 dark:text-gray-300">{index + 1}</td>
              <td className="px-4 py-2 border-b font-medium text-gray-900 dark:text-white">{role.name}</td>
              <td className="px-4 py-2 border-b text-gray-600 dark:text-gray-300">
                {role.permissions.join(", ")}
              </td>
              <td className="px-4 py-2 border-b text-right">
                <Link href="/edit-roles">
                    <button className="text-blue-600 hover:underline mr-3">Edit</button>
                </Link>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
