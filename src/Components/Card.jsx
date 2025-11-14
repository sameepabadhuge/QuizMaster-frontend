import React from "react";

export default function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded shadow flex items-center justify-between">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-gray-400 text-2xl">{icon}</div>
    </div>
  );
}
