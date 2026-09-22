"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  CartesianGrid,
} from "recharts";

const FeedbackCharts = ({ positive = 0, negative = 0 }) => {
  const total = positive + negative;

  const data = [
    {
      name: "Positive",
      value: total ? Math.round((positive / total) * 100) : 0,
    },
    {
      name: "Negative",
      value: total ? Math.round((negative / total) * 100) : 0,
    },
  ];

  return (
    <Box
      sx={{
        mt: 2,
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "10px",
        bgcolor: "background.paper",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
          pt: 1.8,
          pb: 1.2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "15px" },
            fontWeight: 700,
            lineHeight: 1.3,
            color: "text.primary",
          }}
        >
          Feedback Performance
        </Typography>

        <Typography
          sx={{
            mt: 0.4,
            fontSize: "12.5px",
            lineHeight: 1.4,
            color: "text.secondary",
          }}
        >
          Positive and negative feedback distribution
        </Typography>
      </Box>

      <Box
        sx={{
          px: { xs: 1, sm: 2 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: { xs: 190, sm: 210, md: 220 },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              barSize={24}
              margin={{
                top: 5,
                right: 45,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />

              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={70}
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fill: "#64748B",
                }}
              />

              <XAxis
                type="number"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#07876a",
                }}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                formatter={(value) => [`${value}%`, "Feedback"]}
                cursor={{
                  fill: "rgba(15, 23, 42, 0.02)",
                }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="value"
                radius={[0, 6, 6, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.name === "Positive"
                        ? "#07876a"
                        : "#CBD5E1"
                    }
                  />
                ))}

                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value) => `${value}%`}
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 700,
                    fill: "#475569",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackCharts;