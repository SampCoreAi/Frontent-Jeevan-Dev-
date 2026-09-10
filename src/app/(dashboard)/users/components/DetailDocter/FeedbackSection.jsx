"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { API_BASE_URL, API_ENDPOINTS } from "../../../../../config/api";

export default function FeedbackSection({ doctorId }) {
 
  const [reviews, setReviews] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const userObj = JSON.parse(storedUser);

      if (userObj.role_id === 1) {
        setIsUser(true);
      }
    }
  }, []);

  const fetchFeedbacks = async () => {
    if (!doctorId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.DOCTOR_FEEDBACK(doctorId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );




      setReviews(res.data?.data || []);
      setSummary(res.data?.summary || null);
      setError(null);
    } catch (err) {
      console.error("Fetch feedback error:", err);
      setReviews([]);
      setSummary(null);

    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [doctorId]);

 const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setSnackbar({
      open: true,
      message: "Please login to submit feedback.",
      severity: "warning",
    });
    return;
  }

  if (!rating || !reviewText.trim()) {
    setSnackbar({
      open: true,
      message: "Please enter feedback and rating.",
      severity: "warning",
    });
    return;
  }

  setLoading(true);

  try {
    await axios.post(
      `${API_BASE_URL}/feedback/patient/${doctorId}`,
      {
        rating,
        feedback_text: reviewText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReviewText("");
    setRating(0);

    fetchFeedbacks();

    setSnackbar({
      open: true,
      message: "Feedback submitted successfully!",
      severity: "success",
    });
  } catch (err) {
    setSnackbar({
      open: true,
      message:
        err.response?.data?.message ||
        "Failed to submit feedback.",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <Box maxWidth={1300} mx="auto" sx={{
      boxShadow: "0 4px 12px #1e6658",
    }} >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Leave a Message & Rating
        </Typography>

        {!isUser && (
          <Typography sx={{ color: "red", mb: 2 }}>
            Please login as a patient to leave a review.
          </Typography>
        )}

        <Stack
          spacing={3}
          sx={{
            borderBottom: "2px solid grey",
            pb: 2,
            mb: 2,
          }}
        >
          <TextField
            multiline
            minRows={2}
            placeholder="Write your message..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{
              backgroundColor: "#E4ECEB",
              borderRadius: 5,
              "& fieldset": {
                border: "none",
              },
            }}
            disabled={!isUser}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Rating:</Typography>

              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                icon={<StarIcon sx={{ color: "#ffc107" }} />}
                emptyIcon={<StarIcon sx={{ color: "#d0d0d0" }} />}
                readOnly={!isUser}
              />
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isUser || loading}
              sx={{
                backgroundColor: "#20b2aa",
                "&:hover": {
                  backgroundColor: "#189088",
                },
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Stack>

        {summary && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              background: "#fff",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#FFF8E1",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="black">
                  Average Rating
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="warning.main"
                >
                  {summary.avg_rating}
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#E3F2FD",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="black">
                  Total Reviews
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="primary.main"
                >
                  {summary.total_feedbacks}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {reviews.length > 0 ? (
          <Box>
            {reviews.map((rev) => (
              <Paper
                key={rev.id}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box flex={1}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      fontSize={15}
                      color="#1e6658"
                      mb={0.5}
                    >
                      {rev.user_name || "Anonymous"}
                    </Typography>

                    <Typography variant="body1">
                      {rev.feedback_text}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right", minWidth: 150 }}>
                    <Rating
                      value={Number(rev.rating)}
                      readOnly
                      size="small"
                    />

                    <Typography
                      fontSize="0.75rem"
                      color="black"
                      mt={0.5}
                    >
                      {new Date(rev.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography>No reviews found.</Typography>
        )}
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}