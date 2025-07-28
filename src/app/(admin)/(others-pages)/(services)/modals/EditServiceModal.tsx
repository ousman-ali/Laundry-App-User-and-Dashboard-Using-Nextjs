"use client";

import React, { useState } from "react";
import type { Service } from "../available-services/page";
import { useAuth } from "@/context/AuthContext";
type Props = {
  service: Service;
  onClose: () => void;
};

const EditServiceModal = ({ service, onClose }: Props) => {
  const [form, setForm] = useState({
    name: service.name,
    description: service.description || "",
    price_per_kg: service.price_per_kg.toString(),
    urgency_fee: service.urgency_fee.toString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Assuming you have a useAuth hook to get the token
  const PF = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${PF}/services/update/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // adjust if using context
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price_per_kg: parseFloat(form.price_per_kg),
          urgency_fee: parseFloat(form.urgency_fee),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update service");
      }

      // Optionally trigger refresh or notify parent
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Service</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Service Name"
            required
            className="w-full border rounded p-2"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded p-2"
          ></textarea>

          <input
            type="number"
            name="price_per_kg"
            value={form.price_per_kg}
            onChange={handleChange}
            placeholder="Price per kg"
            step="0.01"
            required
            className="w-full border rounded p-2"
          />

          <input
            type="number"
            name="urgency_fee"
            value={form.urgency_fee}
            onChange={handleChange}
            placeholder="Urgency Fee"
            step="0.01"
            required
            className="w-full border rounded p-2"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
