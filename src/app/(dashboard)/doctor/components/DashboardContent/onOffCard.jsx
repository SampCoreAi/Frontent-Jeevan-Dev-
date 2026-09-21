"use client";

import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OnOffCard = ({ graphData = {} }) => {
  const theme = useTheme();

  const onlineData = Array.isArray(graphData?.online_graph)
    ? graphData.online_graph.map((item) => ({
        name: item?.day || "",
        value: Number(item?.value) || 0,
      }))
    : [];

  const offlineData = Array.isArray(graphData?.offline_graph)
    ? graphData.offline_graph.map((item) => ({
        name: item?.day || "",
        value: Number(item?.value) || 0,
      }))
    : [];

  const Card = ({ title, value, data, color }) => {
    const hasData = data.some((item) => item.value > 0);

    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          width: "100%",
          borderRadius: 1.5,
          border: "1px solid #b1b1b1",
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "12.5px",
                color: "text.secondary",
                lineHeight: 1.3,
              }}
            >
              Last week
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                fontSize: "12.5px",
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: 1,
              color,
            }}
          >
            {Number(value) || 0}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 1.5,
            width: "100%",
            height: { xs: 90, sm: 100 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 8,
                  right: 5,
                  bottom: 4,
                  left: 5,
                }}
              >
                <XAxis hide dataKey="name" />
                <YAxis hide domain={hasData ? ["auto", "auto"] : [0, 1]} />
                <Tooltip
                  cursor={{
                    stroke: "#e5e5e5",
                    strokeWidth: 1,
                  }}
                  contentStyle={{
                    padding: "6px 9px",
                    fontSize: "12.5px",
                    borderRadius: "5px",
                    border: "1px solid #d8d8d8",
                    boxShadow: "none",
                  }}
                  labelStyle={{
                    fontSize: "12.5px",
                    color: theme.palette.text.secondary,
                  }}
                  itemStyle={{
                    fontSize: "12.5px",
                    color,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  isAnimationActive={false}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 3,
                    strokeWidth: 0,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography
              sx={{
                fontSize: "12.5px",
                color: "text.secondary",
              }}
            >
              No data available
            </Typography>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card
          title="Offline Patients"
          value={graphData?.offline_total}
          data={offlineData}
          color="#5f6b68"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card
          title="Online Patients"
          value={graphData?.online_total}
          data={onlineData}
          color={theme.palette.primary.main}
        />
      </Grid>
    </Grid>
  );
};

export default OnOffCard;