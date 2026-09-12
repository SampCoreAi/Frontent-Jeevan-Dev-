"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function DoctorCard() {
  const [liked, setLiked] = React.useState(false);

  const [bookLoading, setBookLoading] = React.useState(false);
  const [detailsLoading, setDetailsLoading] = React.useState(false);

  const doctor = {
    name: "Aditya Yadav",
    specialization: "Neurologists",
    hospital: "SAKTI HOSPITAL",
    education: "MBBS",
    experience: "1+ Years",
    fee: 119,
    rating: 0,
    image:
      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  };

  const handleBook = async () => {
    try {
      setBookLoading(true);

      // yaha API call / router.push laga sakte ho
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Book clicked");
    } catch (error) {
      console.log(error);
    } finally {
      setBookLoading(false);
    }
  };

  const handleViewDetails = async () => {
    try {
      setDetailsLoading(true);

      // yaha API call / router.push laga sakte ho
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("View Details clicked");
    } catch (error) {
      console.log(error);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        mt: { xs: 6, sm: 7.5 },
        p: { xs: 1, sm: 2, md: 1 },
        bgcolor: "#f5f7f9",
      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          backgroundColor: "#fff",
          borderRadius: 0.5,
          boxShadow: "0 4px 12px #0f7468",
        }}
      >
        <Card
          sx={{
            maxWidth: 380,
            borderRadius: "16px",
            border: "2px solid #00897b",
            p: 2,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setLiked(!liked)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: liked ? "red" : "#999",
            }}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>

          <CardContent>
            <Box display="flex" gap={2} alignItems="center">
              <Avatar
                src={doctor.image}
                alt={doctor.name}
                sx={{
                  width: 90,
                  height: 90,
                  border: "2px solid #00897b",
                }}
              />

              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="#00897b"
                >
                  {doctor.name}
                </Typography>

                <Typography variant="h6" fontWeight="600" mt={1}>
                  {doctor.specialization}
                </Typography>

                <Typography
                  variant="body1"
                  color="#00897b"
                  fontWeight="500"
                >
                  {doctor.hospital}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" flexDirection="column" gap={1.5}>
              <Typography fontWeight="600">
                Education: {doctor.education}
              </Typography>

              <Typography fontWeight="600">
                Experience: {doctor.experience}
              </Typography>

              <Typography fontWeight="600">
                Fee: ₹{doctor.fee}
              </Typography>

              <Typography fontWeight="600">
                Rating: {doctor.rating}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              display="flex"
              justifyContent="space-between"
              gap={2}
            >
              <Button
                variant="contained"
                onClick={handleBook}
                disabled={bookLoading}
                sx={{
                  flex: 1,
                  backgroundColor: "#00897b",
                  borderRadius: "10px",
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "16px",

                  "&:hover": {
                    backgroundColor: "#00695c",
                  },

                  "&.Mui-disabled": {
                    backgroundColor: "#00897b",
                    color: "#fff",
                    opacity: 0.8,
                  },
                }}
              >
                {bookLoading ? (
                  <CircularProgress
                    size={22}
                    thickness={5}
                    sx={{ color: "#fff" }}
                  />
                ) : (
                  "Book"
                )}
              </Button>

              <Button
                variant="outlined"
                onClick={handleViewDetails}
                disabled={detailsLoading}
                sx={{
                  flex: 1,
                  borderColor: "#00897b",
                  color: "#00897b",
                  borderRadius: "10px",
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "16px",

                  "&.Mui-disabled": {
                    borderColor: "#00897b",
                    color: "#00897b",
                    opacity: 0.8,
                  },
                }}
              >
                {detailsLoading ? (
                  <CircularProgress
                    size={22}
                    thickness={5}
                    sx={{ color: "#00897b" }}
                  />
                ) : (
                  "View Details"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}