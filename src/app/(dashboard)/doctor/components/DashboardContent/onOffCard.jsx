"use client";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, Paper, Typography, useMediaQuery } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OnOffCard = ({ graphData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const textColor = theme.palette.text.primary;
const onlineData =
  (graphData?.online_graph || []).map((d) => ({
    name: d.day,
    value: d.value,
  }));
const offlineData =
 
  (graphData?.offline_graph || []).map((d) => ({
    name: d.day,
    value: d.value,
  }));

const onlineTotal = graphData?.online_total ?? 0;
const offlineTotal = graphData?.offline_total ?? 0;

 const Card = ({ title, subtitle, value, color, data }) => (
    <Paper
      sx={{
        p: 2,
        height: "100%",
        width: "100%",
        borderRadius: 1,
        border: `1px solid ${color}`,
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
    
          <Typography variant="caption" sx={{ color: textColor }}>
            {subtitle}
          </Typography>
          <Typography variant="h6">{title}</Typography>
   
        <Grid>
            <Typography variant="h5">{value}</Typography>
            

        </Grid>
      </Grid>

      <ResponsiveContainer width="100%" height={isSmall ? 120 : 100}>
        <LineChart data={data}>
          <XAxis hide dataKey="name" />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card
  title="Offline patients"
  subtitle="Last week"
  value={offlineTotal}
  color="#e91e63"
  data={offlineData}
/>

      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card
  title="Online patients"
  subtitle="Last week"
  value={onlineTotal}
  color="#00bcd4"
  data={onlineData}
/>
      </Grid>
    </Grid>
  );
};

export default OnOffCard;