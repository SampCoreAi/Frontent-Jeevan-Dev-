import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Card,
  Stack,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";

const requests = [
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Maria Sarafat",
    diagnosis: "Health Checkup",
    time: "9:30",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const RequestCard = () => {
  const theme = useTheme();
  const text = theme.palette.text;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <Card
          sx={{
            width:290,
            p: { xs: 2, sm: 3 },
            borderRadius: 0.5,
            boxShadow: 3,
            border: "1px solid #000000",
            height: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            gutterBottom
          >
            Appointment Request
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              maxHeight: { xs: 240, sm: 300 },
              overflowY: "auto",
              pr: 1,
              scrollbarWidth: "thin",
              scrollbarColor: "#439f8e #dffffa",
              "&::-webkit-scrollbar": {
                width: 8,
              },
              "&::-webkit-scrollbar-track": {
                background: "linear-gradient(180deg, #00ffbf, #b3fff0)",
                borderRadius: 4,
              },
              "&::-webkit-scrollbar-thumb": {
                background: "linear-gradient(180deg, #ff0000, #ff6f61)",
                borderRadius: 4,
                boxShadow: "inset 0 0 4px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "linear-gradient(180deg, #ff3030, #ff7f7f)",
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.4)",
              },
            }}
          >
            {requests.map((r, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#f5f5f5" },
                  mb: 1,
                  minWidth: "fit-content",
                }}
              >
                <Avatar src={r.avatar} sx={{ width: 48, height: 48 }} />

                <Box sx={{ flex: 1, minWidth: 120 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
                  >
                    {r.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#888", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                    noWrap
                  >
                    {r.diagnosis}
                  </Typography>
                </Box>

                <Chip
                  label={r.time}
                  variant="outlined"
                  sx={{
                    minWidth: 60,
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  }}
                />

                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" color="success">
                    <CheckCircleIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="info">
                    <ChatIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Box>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              mt: 2,
              textTransform: "none",
              fontSize: { xs: "0.85rem", sm: "1rem" },
              color: text.primary,
            }}
          >
            View More
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RequestCard;
