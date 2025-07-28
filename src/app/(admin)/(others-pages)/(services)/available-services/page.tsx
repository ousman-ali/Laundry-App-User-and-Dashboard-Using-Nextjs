"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

// Modal components would go here or in separate files
import ViewServiceModal from "../modals/ViewServiceModal";
import EditServiceModal from "../modals/EditServiceModal";
import DeleteServiceModal from "../modals/DeleteServiceModal";
import { useRouter } from "next/navigation";

export type Service = {
  id: number;
  name: string;
  price_per_kg: number;
  urgency_fee: number;
  description?: string;
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);
  const router = useRouter();

  const PF = process.env.NEXT_PUBLIC_API_URL;
  const { loading: authLoading, token } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const fetchServices = async () => {
      try {
        const res = await fetch(`${PF}/services/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch services.");
        const data = await res.json();
        setServices(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [authLoading, token]);

  const openModal = (type: "view" | "edit" | "delete", service: Service) => {
    setSelectedService(service);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedService(null);
    setModalType(null);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading services...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Available Services</h1>
        <button
            onClick={() => router.push("/add-services")}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition ml-4"
        >
            Add New Service
        </button>
        </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left text-gray-600 dark:text-gray-300 uppercase text-sm font-semibold">
              <th className="px-6 py-4 border-b">#</th>
              <th className="px-6 py-4 border-b">Name</th>
              <th className="px-6 py-4 border-b">Description</th>
              <th className="px-6 py-4 border-b">Price / kg</th>
              <th className="px-6 py-4 border-b">Urgency Fee</th>
              <th className="px-6 py-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-6 py-4 border-b">{index + 1}</td>
                <td className="px-6 py-4 border-b">{service.name}</td>
                <td className="px-6 py-4 border-b">{service.description || "-"}</td>
                <td className="px-6 py-4 border-b">{service.price_per_kg}</td>
                <td className="px-6 py-4 border-b">{service.urgency_fee}</td>
                <td className="px-6 py-4 border-b space-x-2 flex">
                  <EyeIcon
                    className="w-5 h-5 text-blue-500 cursor-pointer"
                    onClick={() => openModal("view", service)}
                  />
                  <PencilIcon
                    className="w-5 h-5 text-yellow-500 cursor-pointer"
                    onClick={() => openModal("edit", service)}
                  />
                  <TrashIcon
                    className="w-5 h-5 text-red-500 cursor-pointer"
                    onClick={() => openModal("delete", service)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalType === "view" && selectedService && (
        <ViewServiceModal service={selectedService} onClose={closeModal} />
      )}

      {modalType === "edit" && selectedService && (
        <EditServiceModal service={selectedService} onClose={closeModal} />
      )}

      {modalType === "delete" && selectedService && (
        <DeleteServiceModal service={selectedService} onClose={closeModal} />
      )}
    </div>
  );
};

export default ServicesPage;
