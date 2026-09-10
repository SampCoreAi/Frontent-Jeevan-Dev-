"use client";
import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
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
    <Grid sx={{ mt: 4 }}>
      <Grid size={{ xs: 12 }}>

        <Box
          sx={{
            p: 3,

          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1e6658",
              marginBottom: "15px",
              textAlign: { xs: "center", md: "left" } // center on mobile
            }}
          >
            Feedback Performance
          </Typography>

          <Box sx={{ height: 220, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                barSize={30}
                margin={{ top: 10, right: 40, left: 10, bottom: 30 }}
              >
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 14, fontWeight: 500 }}
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip formatter={(value) => `${value}%`} />

                <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.name === "Positive"
                          ? "#1e6658"
                          : "#b0bec5"}
                    />
                  ))}

                  <LabelList
                    dataKey="value"
                    position="right"
                    style={{ fontWeight: "bold", fill: "#1e6658" }}
                    formatter={(v) => `${v}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

      </Grid>
    </Grid>
  );
};

export default FeedbackCharts;