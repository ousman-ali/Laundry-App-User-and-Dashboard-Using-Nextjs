"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

const commonClothingTypes = ["Shirt", "Pants", "Jacket", "Bedsheet", "Dress", "Skirt"];

const services = [
  { name: "Washing", pricePerKg: 25 },
  { name: "Ironing", pricePerKg: 20 },
  { name: "Dry Cleaning", pricePerKg: 40 },
  { name: "Wash & Iron", pricePerKg: 35 },
];

export default function LaundryOrderForm() {
  const [orderType, setOrderType] = useState<"normal" | "urgent" | null>("normal");
  const [items, setItems] = useState<{ type: string; quantity: number }[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [customType, setCustomType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState("");

  const urgentFeePerKg = 10;

  const actualItemType = selectedType === "custom" ? customType.trim() : selectedType;

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
  const basePricePerKg = baseService ? baseService.pricePerKg : 0;

  const totalPrice =
    (weight || 0) *
    (basePricePerKg + (orderType === "urgent" ? urgentFeePerKg : 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Order placed!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 dark:text-white rounded-xl space-y-6 transition-colors"
    >
      <h2 className="text-3xl font-bold text-center text-gray-600 dark:text-gray-100 mb-6">
        Laundry Order Form
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Customer Info */}
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Customer Info</h3>

          {["Name", "Phone", "Address"].map((label) => (
            <div key={label}>
              <label className="block font-medium text-gray-600 dark:text-gray-400">{label}</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          ))}
        </div>

        {/* Right: Order Info */}
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Order Details</h3>

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
                <option key={service.name} value={service.name}>
                  {service.name} ({service.pricePerKg} birr/kg)
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
                      {type} {type === "urgent" && `(+${urgentFeePerKg} birr/kg)`}
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
                className="bg-blue-100 dark:bg-blue-800 dark:text-white text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200"
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
          className="w-[20%] justify-end mt-6 bg-blue-100  hover:bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-700 py-3 font-semibold rounded-md"
        >
          Submit Order
        </button>
      </div>
    </form>
  );
}
