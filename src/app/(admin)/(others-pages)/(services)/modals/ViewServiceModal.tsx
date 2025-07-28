"use client";

import React from "react";
import type { Service } from "../available-services/page";

type Props = {
  service: Service;
  onClose: () => void;
};

const ViewServiceModal = ({ service, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">View Service</h2>

        <div className="space-y-3">
          <p><strong className="text-gray-700 dark:text-gray-300">Name:</strong> {service.name}</p>
          <p><strong className="text-gray-700 dark:text-gray-300">Description:</strong> {service.description || "No description"}</p>
          <p><strong className="text-gray-700 dark:text-gray-300">Price per kg:</strong> {service.price_per_kg} ETB</p>
          <p><strong className="text-gray-700 dark:text-gray-300">Urgency Fee:</strong> {service.urgency_fee} ETB</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewServiceModal;
