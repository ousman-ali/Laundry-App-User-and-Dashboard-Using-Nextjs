"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Role = {
  name: string;
  permissions?: Permission[];
};

type Permission = {
  name: string;
  // Add other fields if your API returns more
};

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: ""
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [role, setRole] = useState("");
  const [roleLists, setRoleLists] = useState<Role[]>([]);
  const PF = process.env.NEXT_PUBLIC_API_URL;
  const { loading, token } = useAuth();

  useEffect(()=>{
    const fetchRoles = async () => {
      try {
        if(!loading){
          const res = await axios.get(`${PF}/roles/all`, 
            {headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Or use context
            }});
          setRoleLists(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchRoles();
  }, [loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // if (name === "role") {
    //   setPermissions(rolePermissionsMap[value] || []);
    // }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRole(value);
    const selectedRole = roleLists.find(r => r.name === value);
  if (selectedRole && selectedRole.permissions) {
    // // If permissions is an array of objects with a 'name' property
    // const permissionNames = selectedRole.permissions.map((p: any) => p.name);
    setPermissions(selectedRole.permissions);
  } else {
    setPermissions([]);
  }
  };

  // const handleRemovePermission = (perm: string) => {
  //   setPermissions((prev) => prev.filter((p) => p !== perm));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${PF}/auth/register`, formData);
        const user = res.data?.user;
      const userId = user?.id;

      if (!userId) {
          console.error("User ID not found in response");
          return;
        }

        //2️⃣ Assign the selected role to the new user using their ID
        await axios.post(`${PF}/users/${userId}/roles`, {
          roles: [role],
        });

        alert(`Role "${role}" assigned to user ${user?.name} (ID: ${userId})`);
    } catch (error) {
        console.log(error);
      }
    const submission = { ...formData, permissions };
    console.log("Submitting user:", submission);
    // Send to API
  };

  
          console.log("Role Lists", roleLists);

  return (
    <div className="max-w-6xl mx-auto p-10 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
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
              placeholder="Enter full name"
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
              placeholder="Enter email"
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
              placeholder="Enter phone number"
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
              placeholder="Enter password"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm password"
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
              value={role}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700"
            >
              {roleLists.map((roleList)=>(
                <option key={roleList.name} value={roleList.name}>
                  {roleList.name}
                </option>
              ))}
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
                    {perm.name}
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
            className="py-2 px-6 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition"
            >
            Add User
        </button>
      </div>
    </div>
  );
}
