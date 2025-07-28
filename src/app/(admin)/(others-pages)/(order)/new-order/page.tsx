"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const commonClothingTypes = ["Shirt", "Pants", "Jacket", "Bedsheet", "Dress", "Skirt"];

export default function LaundryOrderForm() {
  const [orderType, setOrderType] = useState<"normal" | "urgent" | null>("normal");
  const [items, setItems] = useState<{ type: string; quantity: number }[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [customType, setCustomType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [services, setServices] = useState<{ id: number; name: string; price_per_kg: number; urgency_fee: number }[]>([]);
  const { loading: authLoading, token } = useAuth();
  const PF = process.env.NEXT_PUBLIC_API_URL;


  const actualItemType = selectedType === "custom" ? customType.trim() : selectedType;

  useEffect(() => {
    if (authLoading || !token) return;

    const fetchServices = async () => {
      try {
        const response = await fetch(`${PF}/services/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Assuming you have a token from context or props
          }
        });
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    };
    fetchServices();
  }, [authLoading, token]);

  const handleAddItem = () => {
    if (!actualItemType || quantity <= 0) return;

    const existingIndex = items.findIndex((item) => item.type === actualItemType);
    if (existingIndex !== -1) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      setItems(updated);
    } else {
      setItems([...items, { type: actualItemType, quantity }]);
    }

    setSelectedType("");
    setCustomType("");
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const baseService = services.find((s) => s.name === selectedService);
  const basePricePerKg = baseService ? baseService.price_per_kg : 0;
  const urgencyFeePerKg = baseService ? baseService.urgency_fee : 0;

  const totalPrice =
  (weight || 0) * basePricePerKg +
  (orderType === "urgent" ? (weight || 0) * urgencyFeePerKg : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Order placed!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-8 bg-white dark:bg-gray-900 dark:text-white rounded-xl space-y-6 shadow-xl transition-all"
    >
      <h2 className="text-3xl font-bold text-center text-gray-700 dark:text-white mb-6">
        Laundry Order Form
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Customer Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Customer Info</h3>

          {[
            { label: "Name", type: "text" },
            { label: "Phone", type: "text" },
            { label: "Address", type: "text" },
          ].map(({ label, type }) => (
            <div key={label}>
              <label className="block font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
              <input
                required
                type={type}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          ))}

          <div>
            <label className="block font-medium text-gray-600 dark:text-gray-400 mb-1">Pickup Date</label>
            <input
              required
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Right: Order Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Order Details</h3>

          {/* Service Selection */}
          <div>
            <label className="block font-medium text-gray-600 dark:text-gray-400 mb-1">
              Select Service
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">-- Choose a Service --</option>
              {services.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name} ({service.price_per_kg} birr/kg)
                </option>
              ))}
            </select>
          </div>

          {/* Order Type */}
          <div>
            <label className="block font-medium text-gray-600 dark:text-gray-400 mb-1">Order Type</label>
            <div className="flex gap-4">
              {(["normal", "urgent"] as const).map((type) => {
                const isSelected = orderType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(isSelected ? null : type)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-150 ${
                      isSelected
                        ? "bg-blue-100 border-blue-600 text-blue-800 dark:bg-blue-800 dark:text-white"
                        : "bg-white border-gray-400 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-blue-600" : "border-gray-400"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isSelected ? "bg-blue-600" : "bg-transparent"
                        }`}
                      />
                    </div>
                    <span className="capitalize">
                      {type} {type === "urgent" && `(+${urgencyFeePerKg} birr/kg)`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clothing Item & Quantity */}
          <div>
            <label className="block font-medium text-gray-600 dark:text-gray-400 mb-1">
              Clothing Item & Quantity
            </label>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">Select Clothing Type</option>
                {commonClothingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                <option value="custom">Other (Custom)</option>
              </select>

              {selectedType === "custom" && (
                <input
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Enter custom item"
                  className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              )}

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-[80px] px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Qty"
              />

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>

            {/* Display Added Items */}
            <div className="flex flex-wrap gap-2 mt-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-green-100 text-blue-800 dark:bg-green-800 dark:text-white px-3 py-1 rounded-full text-sm "
                >
                  {item.quantity} x {item.type}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Weight Input */}
          <div>
            <label className="block font-medium text-gray-600 dark:text-gray-400">
              Total Weight (kg)
            </label>
            <input
              type="number"
              min={0}
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Net weight"
            />
          </div>

          {/* Total Price */}
          <div className="text-right text-lg font-semibold text-blue-700 dark:text-blue-300">
            Total: {totalPrice} birr
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 font-semibold rounded-md"
        >
          Submit Order
        </button>
      </div>
    </form>
  );
}
