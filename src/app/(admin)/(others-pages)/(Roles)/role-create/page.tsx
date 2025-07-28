"use client";

import React, { useEffect, useState } from "react";
import { usePermissions } from "@/context/PermissionsContext";
import { useAuth } from "@/context/AuthContext";


export default function RolePermissionsPage() {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const PF = process.env.NEXT_PUBLIC_API_URL;
  const { token } = useAuth();
  const { permissions: permissionsListFromBackend, loading } = usePermissions();
  

  useEffect(() => {
    console.log("Fetched permissions from context:", permissionsListFromBackend);
    console.log("Loading status:", loading);
  }, [permissionsListFromBackend, loading]);

  useEffect(() => {
  console.log("Selected permissions:", permissions);
}, [permissions]);


  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const clearForm = () => {
    setRoleName("");
    setPermissions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      alert("Please enter a role name.");
      return;
    }

      try {
        const res = await fetch(`${PF}/roles/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Or use context
          },
          body: JSON.stringify({
            name: roleName,
            permissions: permissions, // Array of selected perm.name
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong");

        alert("Role created successfully!");
      clearForm();
    } catch (err: any) {
      alert(err.message);
    }

    clearForm();
  };


  return (
    <div className="w-[90%] mx-auto p-3 bg-white rounded shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create Role & Assign Permissions</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="roleName" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Role Name
          </label>
          <input
            id="roleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700"
            required
          />
        </div>

        <div>
          <p className="font-medium mb-2 text-gray-700 dark:text-gray-200">Permissions</p>
          <div
            className="grid grid-cols-3 gap-3 overflow-hidden border rounded p-2 border-gray-300 dark:border-gray-700"
            style={{ scrollbarWidth: "thin" }}
          >
            {permissionsListFromBackend?.map((perm) => (
              <label
                key={perm.id}
                className="inline-flex items-center space-x-2 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={permissions.includes(perm.name)}
                  onChange={() => togglePermission(perm.name)}
                  className="custom-checkbox"
                />
                <span className="capitalize text-gray-800 dark:text-gray-200">{perm.name}</span>
              </label>
            ))}
          </div>
        </div>

       <div className="flex justify-center">
        <button
            type="submit"
            disabled={!roleName.trim()}
            className={`w-[50%] py-2 rounded-md text-white ${
            roleName.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            } transition-colors`}
        >
            Create Role
        </button>
      </div>
      </form>

      <style jsx>{`
        input.custom-checkbox {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #cbd5e1; /* border-gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          background-color: white;
          cursor: pointer;
          position: relative;
          transition: background-color 0.2s, border-color 0.2s;
        }
        input.custom-checkbox:checked {
          background-color: #2563eb; /* bg-blue-600 */
          border-color: #2563eb;
        }
        input.custom-checkbox:checked::after {
          content: "";
          position: absolute;
          top: 2px;
          left: 6px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        input.custom-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5); /* blue ring */
        }
      `}</style>
    </div>
  );
}
