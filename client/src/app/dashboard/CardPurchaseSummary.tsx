import { useGetDashboardMetricsQuery } from "@/app/state/api";
import { TrendingDown, TrendingUp } from "lucide-react";
import numeral from "numeral";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CountUp from "react-countup";

const CardPurchaseSummary = () => {
  const { data, isLoading } = useGetDashboardMetricsQuery();
  const purchaseData = data?.purchaseSummary || [];

  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
          Purchase Summary
        </h2>
        <hr />
      </div>

      {/* BODY */}
      <div>
        {isLoading ? (
          <div className="m-5 animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-48 bg-gray-100 rounded"></div>
          </div>
        ) : (
          <>
            {/* BODY HEADER */}
            <div className="mb-4 mt-7 px-7">
              <p className="text-xs text-gray-400">Purchased</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">
                  {lastDataPoint ? (
                    <CountUp
                      end={lastDataPoint.totalPurchased}
                      prefix="$"
                      decimals={0}
                      duration={1}
                      formattingFn={(val) => numeral(val).format("0.00a")}
                    />
                  ) : (
                    "0"
                  )}
                </p>
                {lastDataPoint && (
                  <p
                    className={`text-sm ${
                      lastDataPoint.changePercentage! >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    } flex ml-3 items-center`}
                  >
                    {lastDataPoint.changePercentage! >= 0 ? (
                      <TrendingUp className="w-5 h-5 mr-1" />
                    ) : (
                      <TrendingDown className="w-5 h-5 mr-1" />
                    )}
                    {Math.abs(lastDataPoint.changePercentage!)}%
                  </p>
                )}
              </div>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={200} className="p-2">
              <AreaChart
                data={purchaseData}
                margin={{ top: 0, right: 0, left: -50, bottom: 45 }}
              >
                <defs>
                  <linearGradient
                    id="colorPurchase"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={false} axisLine={false} />
                <YAxis tickLine={false} tick={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "0.5rem",
                    border: "none",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalPurchased"
                  stroke="#8884d8"
                  fill="url(#colorPurchase)"
                  dot={true}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-center text-gray-400 pb-3">
              Purchase trends over time
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CardPurchaseSummary;
