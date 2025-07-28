"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const CreateServicePage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price_per_kg: "",
    urgency_fee: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const PF = process.env.NEXT_PUBLIC_API_URL;
  const { loading: authLoading, token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authLoading || !token) {
      setError("Authentication is loading...");   
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${PF}/services/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
        throw new Error(errorData.message || "Failed to create service");
      }

      setSuccess(true);
      setForm({ name: "", description: "", price_per_kg: "", urgency_fee: "" });
      alert("Service created successfully!");
      // Optionally redirect to the services page
      router.push("/available-services");
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Service</h1>

      {success && (
        <p className="text-green-600 mb-4 text-center">Service created successfully!</p>
      )}
      {error && (
        <p className="text-red-600 mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Service Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Price per Kg (ETB)</label>
          <input
            type="number"
            name="price_per_kg"
            value={form.price_per_kg}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Urgency Fee (ETB)</label>
          <input
            type="number"
            name="urgency_fee"
            value={form.urgency_fee}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            step="0.01"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
    </div>
  );
};

export default CreateServicePage;
