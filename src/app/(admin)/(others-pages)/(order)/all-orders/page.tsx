"use client";

import React from "react";
import Link from "next/link";

const orders = [
  {
    id: 1,
    ticket: "TCK-001",
    orderType: "urgent",
    status: "Pending",
    createdAt: "2025-07-21",
  },
  {
    id: 2,
    ticket: "TCK-002",
    orderType: "normal",
    status: "Completed",
    createdAt: "2025-07-20",
  },
  {
    id: 3,
    ticket: "TCK-003",
    orderType: "normal",
    status: "Processing",
    createdAt: "2025-07-19",
  },
];

export default function BasicOrdersTable() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Laundry Tickets</h2>
        <Link href="/new-order">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            + New Order
            </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="py-3 px-4">Ticket #</th>
              <th className="py-3 px-4">Order Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-3 px-4 font-medium">{order.ticket}</td>
                <td className="py-3 px-4 capitalize">
                  {order.orderType === "urgent" ? (
                    <span className="bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300 px-2 py-1 rounded text-xs">
                      Urgent
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                      Normal
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.status === "Completed"
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : order.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
                        : "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">{order.createdAt}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
