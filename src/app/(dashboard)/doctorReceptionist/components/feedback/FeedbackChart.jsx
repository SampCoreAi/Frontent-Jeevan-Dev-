import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Grid, useMediaQuery } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTheme } from "@mui/material/styles";

const data = [
  { name: "Positive", value: 65, color: "#28a745" }, // green
  { name: "Negative", value: 35, color: "#ff4d4f" }, // red
];

const FeedbackChart = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Set chart sizes based on screen size
  const chartSize = isSmallScreen ? 180 : 220;
  const outerRadius = isSmallScreen ? 60 : 80;

  return (
     <Grid item xs={12} md={6} lg={4} sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: 'center', width:"100%" }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontSize: { xs: 20, md: 24 },
          fontWeight: 600,
          color: "#0f7468",
          textAlign: "center",
        }}
      >
        Feedback Overview
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent:"center",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          p: { xs: 2, sm: 3 },
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          width: "100%",
          maxWidth: 500,
          margin: "auto",
        }}
      >
        {/* Pie Chart */}
        <PieChart width={chartSize} height={chartSize}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Legend / Labels */}
        <List
          sx={{
            ml: { xs: 0, sm: 3 },
            mt: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {data.map((item) => (
            <ListItem key={item.name} sx={{ py: 0, px: 0 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: item.color,
                  borderRadius: "50%",
                  mr: 1,
                }}
              />
              <ListItemText primary={`${item.name} - ${item.value}%`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Grid>
  );
};

export default FeedbackChart;
