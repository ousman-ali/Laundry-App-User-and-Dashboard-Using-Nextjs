"use client";

import React, { useState } from "react";
import type { Service } from "../available-services/page";
import { useAuth } from "@/context/AuthContext";
const PF = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  service: Service;
  onClose: () => void;
};

const DeleteServiceModal = ({ service, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Assuming you have a useAuth hook to get the token 

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${PF}/services/delete/${service.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // adjust if needed
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete service");
      }

      onClose(); // optionally you can refresh list from parent
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-red-600 mb-4">
          Confirm Deletion
        </h2>

        <p className="text-center mb-4">
          Are you sure you want to delete <strong>{service.name}</strong>?
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteServiceModal;
