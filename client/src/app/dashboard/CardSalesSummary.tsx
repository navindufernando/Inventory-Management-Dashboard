import { useGetDashboardMetricsQuery } from "@/app/state/api";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardSalesSummary = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  const salesData = data?.salesSummary || [];

  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum =
    salesData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

  const averageChangePercentage =
    salesData.reduce((acc, curr, _, array) => {
      return acc + curr.changePercentage! / array.length;
    }, 0) || 0;

  const highestValueData = salesData.reduce((acc, curr) => {
    return acc.totalValue > curr.totalValue ? acc : curr;
  }, salesData[0] || {});

  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  const isHighest = (value: number) => value === highestValueData.totalValue;

  if (isError) {
    return <div className="m-5 text-red-500">Failed to fetch data</div>;
  }

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-52 bg-gray-100 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="px-7 pt-5">
            <h2 className="text-lg font-semibold mb-2">Sales Summary</h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* METRICS + TOGGLE */}
            <div className="flex justify-between items-center px-7 mt-5 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Sales</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold">
                    ${(totalValueSum / 1_000_000).toFixed(2)}m
                  </span>
                  <span className="text-green-600 text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {averageChangePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex gap-2">
                {["daily", "weekly", "monthly"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1 text-sm rounded-full border transition ${
                      timeframe === t
                        ? "bg-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={300} className="px-7">
              <BarChart
                data={salesData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(value) =>
                    `$${(value / 1_000_000).toFixed(0)}m`
                  }
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Bar
                  dataKey="totalValue"
                  radius={[10, 10, 0, 0]}
                  barSize={12}
                  fill="#3b82f6"
                >
                  {salesData.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={isHighest(entry.totalValue) ? "#1d4ed8" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER */}
          <div>
            <hr />
            <div className="flex justify-between items-center px-7 mt-4 mb-4 text-sm text-gray-600">
              <span>{salesData.length} data points</span>
              <span>
                Highest Sales:{" "}
                <span className="font-bold text-gray-800">
                  {highestValueDate}
                </span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;
