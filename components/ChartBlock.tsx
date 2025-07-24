"use client";

import { NodeViewWrapper } from "@tiptap/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaFilter, FaExpand, FaChevronDown } from "react-icons/fa";

const data = [
  { name: "Not started", value: 1, fill: "#E5E7EB" }, // gray-200
  { name: "In progress", value: 2, fill: "#3B82F6" }, // blue-500
  { name: "Done", value: 1, fill: "#10B981" }, // green-500
];

const ChartBlock = () => {
  return (
    <NodeViewWrapper className="my-4">
      <div className="w-full text-gray-900 rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          {/* Left buttons */}
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-900 px-3 py-1 rounded-md text-sm font-medium shadow-sm">
              Chart
            </button>
            <button className="text-gray-500 hover:text-gray-800 px-3 py-1 rounded-md text-sm">
              Data
            </button>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-800 p-2">
              <FaFilter />
            </button>
            <button className="text-gray-500 hover:text-gray-800 p-2">
              <FaExpand />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
              New <FaChevronDown className="text-xs" />
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-64 px-4 py-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Bar key={`bar-${index}`} dataKey="value" fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ChartBlock;
