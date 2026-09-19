"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  CircularProgress,
  Chip,
} from "@mui/material";

import {
  StarRounded,
  RateReviewOutlined,
  SendRounded,
  PersonOutline,
} from "@mui/icons-material";

import {
  API_BASE_URL,
  API_ENDPOINTS,
} from "../../../../../config/api";

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

  // =====================================================
  // CHECK USER
  // =====================================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const userObj = JSON.parse(storedUser);

        if (userObj.role_id === 1) {
          setIsUser(true);
        }
      }
    } catch (error) {
      console.error("User parse error:", error);
    }
  }, []);

  // =====================================================
  // FETCH FEEDBACK
  // =====================================================

  const fetchFeedbacks = async () => {
    if (!doctorId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.DOCTOR_FEEDBACK(
          doctorId
        )}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      setReviews(res.data?.data || []);

      setSummary(
        res.data?.summary || null
      );

      setError(null);
    } catch (err) {
      console.error(
        "Fetch feedback error:",
        err
      );

      setReviews([]);
      setSummary(null);

      setError(
        err.response?.data?.message ||
          "Unable to load reviews."
      );
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [doctorId]);

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const handleSubmit = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setSnackbar({
        open: true,
        message:
          "Please login to submit feedback.",
        severity: "warning",
      });

      return;
    }

    if (!rating) {
      setSnackbar({
        open: true,
        message: "Please select a rating.",
        severity: "warning",
      });

      return;
    }

    if (!reviewText.trim()) {
      setSnackbar({
        open: true,
        message:
          "Please write your feedback.",
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
          feedback_text:
            reviewText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviewText("");
      setRating(0);

      await fetchFeedbacks();

      setSnackbar({
        open: true,
        message:
          "Feedback submitted successfully!",
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

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        maxWidth: 1300,
        mx: "auto",
        pb: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",

          borderRadius: 2.5,

          overflow: "hidden",

          bgcolor: "background.paper",
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box
          sx={{
            px: {
              xs: 1.4,
              sm: 1.8,
            },

            py: 1.3,

            borderBottom: "1px solid",
            borderColor: "divider",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            gap: 1,

            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
            }}
          >
            {/* ICON */}

            <Box
              sx={{
                width: 34,
                height: 34,

                borderRadius: 1.6,

                bgcolor: "secondary.light",
                color: "primary.main",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RateReviewOutlined
                sx={{
                  fontSize: 18,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.25,
                }}
              >
                Patient Reviews
              </Typography>

              <Typography
                sx={{
                  mt: 0.1,

                  fontSize: 10,

                  color: "text.secondary",
                }}
              >
                Experiences shared by patients
              </Typography>
            </Box>
          </Box>

          {/* TOTAL REVIEWS CHIP */}

          {summary && (
            <Chip
              label={`${
                summary.total_feedbacks || 0
              } Reviews`}
              size="small"
              sx={{
                height: 24,

                bgcolor:
                  "secondary.light",

                color: "primary.dark",

                fontWeight: 700,
                fontSize: 9.5,

                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          )}
        </Box>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <Box
          sx={{
            p: {
              xs: 1.3,
              sm: 1.7,
            },
          }}
        >
          {/* =====================================================
              RATING SUMMARY
          ===================================================== */}

          {summary && (
            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },

                gap: 0.8,

                mb: 1,
              }}
            >
              {/* AVERAGE RATING */}

              <Box
                sx={{
                  p: 1,

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 1.8,

                  display: "flex",
                  alignItems: "center",

                  gap: 0.9,

                  bgcolor:
                    "secondary.light",
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    minWidth: 38,

                    borderRadius: 1.5,

                    bgcolor:
                      "background.paper",

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <StarRounded
                    sx={{
                      fontSize: 21,

                      color:
                        "warning.main",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 9.5,
                      color:
                        "text.secondary",
                    }}
                  >
                    Average Rating
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 700,
                        color:
                          "text.primary",
                      }}
                    >
                      {Number(
                        summary.avg_rating ||
                          0
                      ).toFixed(1)}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 9.5,
                        color:
                          "text.secondary",
                      }}
                    >
                      / 5
                    </Typography>
                  </Box>

                  <Rating
                    value={Number(
                      summary.avg_rating || 0
                    )}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{
                      fontSize: 16,
                    }}
                  />
                </Box>
              </Box>

              {/* TOTAL REVIEWS */}

              <Box
                sx={{
                  p: 1,

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 1.8,

                  display: "flex",
                  alignItems: "center",

                  gap: 0.9,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    minWidth: 38,

                    borderRadius: 1.5,

                    bgcolor:
                      "secondary.light",

                    color:
                      "primary.main",

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <RateReviewOutlined
                    sx={{
                      fontSize: 20,
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 9.5,

                      color:
                        "text.secondary",
                    }}
                  >
                    Total Reviews
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.1,

                      fontSize: 18,
                      fontWeight: 700,

                      color:
                        "text.primary",
                    }}
                  >
                    {summary.total_feedbacks ||
                      0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* =====================================================
              REVIEW FORM
          ===================================================== */}

          <Box
            sx={{
              p: {
                xs: 1,
                sm: 1.2,
              },

              mb: 1.3,

              border: "1px solid",
              borderColor: "divider",

              borderRadius: 1.8,

              bgcolor:
                "background.default",
            }}
          >
            {/* FORM HEADER */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 0.6,

                mb: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,

                  borderRadius: 1.3,

                  bgcolor:
                    "secondary.light",

                  color:
                    "primary.main",

                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                }}
              >
                <RateReviewOutlined
                  sx={{
                    fontSize: 15,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      "text.primary",
                  }}
                >
                  Leave a Review
                </Typography>

                <Typography
                  sx={{
                    fontSize: 9.5,

                    color:
                      "text.secondary",
                  }}
                >
                  Share your experience
                  with this doctor
                </Typography>
              </Box>
            </Box>

            {/* LOGIN MESSAGE */}

            {!isUser && (
              <Alert
                severity="info"
                sx={{
                  mb: 0.8,

                  py: 0,

                  fontSize: 10,

                  "& .MuiAlert-icon": {
                    fontSize: 17,
                    py: 0.6,
                  },

                  "& .MuiAlert-message": {
                    py: 0.6,
                  },
                }}
              >
                Please login as a patient
                to leave a review.
              </Alert>
            )}

            {/* TEXTAREA */}

            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              placeholder="Write your experience..."
              value={reviewText}
              onChange={(e) =>
                setReviewText(
                  e.target.value
                )
              }
              disabled={
                !isUser || loading
              }
              sx={{
                bgcolor:
                  "background.paper",

                "& .MuiOutlinedInput-root":
                  {
                    borderRadius: 1.5,

                    fontSize: 11.5,

                    p: 1,
                  },

                "& textarea": {
                  lineHeight: 1.5,
                },
              }}
            />

            {/* RATING + BUTTON */}

            <Box
              sx={{
                mt: 0.9,

                display: "flex",

                flexDirection: {
                  xs: "column",
                  sm: "row",
                },

                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },

                justifyContent:
                  "space-between",

                gap: 1,
              }}
            >
              {/* RATING */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  gap: 0.8,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 600,

                    color:
                      "text.secondary",
                  }}
                >
                  Your Rating
                </Typography>

                <Rating
                  value={rating}
                  onChange={(
                    event,
                    newValue
                  ) => {
                    setRating(
                      newValue || 0
                    );
                  }}
                  disabled={
                    !isUser || loading
                  }
                  size="small"
                  sx={{
                    fontSize: 20,
                  }}
                />

                {rating > 0 && (
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,

                      color:
                        "text.primary",
                    }}
                  >
                    {rating}/5
                  </Typography>
                )}
              </Box>

              {/* SUBMIT */}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  !isUser || loading
                }
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={14}
                      color="inherit"
                    />
                  ) : (
                    <SendRounded
                      sx={{
                        fontSize:
                          "15px !important",
                      }}
                    />
                  )
                }
                sx={{
                  minWidth: {
                    xs: "100%",
                    sm: 125,
                  },

                  py: 0.65,
                  px: 1.5,

                  borderRadius: 1.5,

                  fontSize: 10.5,
                  fontWeight: 700,

                  textTransform: "none",

                  boxShadow: "none",

                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Review"}
              </Button>
            </Box>
          </Box>

          {/* =====================================================
              REVIEWS HEADER
          ===================================================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              mb: 0.8,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 13,
                color: "text.primary",
              }}
            >
              Patient Experiences
            </Typography>

            {reviews.length > 0 && (
              <Typography
                sx={{
                  fontSize: 9.5,
                  color:
                    "text.secondary",
                }}
              >
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
              </Typography>
            )}
          </Box>

          {/* ERROR */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 1,

                py: 0,

                fontSize: 10,

                "& .MuiAlert-message": {
                  py: 0.6,
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* =====================================================
              REVIEWS LIST
          ===================================================== */}

          {reviews.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gap: 0.7,
              }}
            >
              {reviews.map(
                (rev, index) => {
                  const name =
                    rev.user_name ||
                    "Anonymous";

                  return (
                    <ReviewCard
                      key={
                        rev.id ||
                        `${name}-${index}`
                      }
                      review={rev}
                      name={name}
                    />
                  );
                }
              )}
            </Box>
          ) : (
            !error && (
              /* EMPTY STATE */

              <Box
                sx={{
                  py: 2.5,
                  px: 1,

                  textAlign: "center",

                  border: "1px dashed",
                  borderColor:
                    "divider",

                  borderRadius: 1.8,

                  bgcolor:
                    "background.default",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,

                    mx: "auto",

                    borderRadius: 1.7,

                    bgcolor:
                      "secondary.light",

                    color:
                      "primary.main",

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <RateReviewOutlined
                    sx={{
                      fontSize: 21,
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    mt: 0.6,

                    fontSize: 12,
                    fontWeight: 700,

                    color:
                      "text.primary",
                  }}
                >
                  No Reviews Yet
                </Typography>

                <Typography
                  sx={{
                    mt: 0.2,

                    fontSize: 9.5,

                    color:
                      "text.secondary",
                  }}
                >
                  Be the first patient to
                  share your experience.
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Paper>

      {/* =====================================================
          SNACKBAR
      ===================================================== */}

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
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* ==========================================================
   REVIEW CARD
========================================================== */

function ReviewCard({ review, name }) {
  const reviewDate =
    review?.created_at
      ? new Date(
          review.created_at
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  return (
    <Box
      sx={{
        p: {
          xs: 1,
          sm: 1.2,
        },

        display: "flex",
        alignItems: "flex-start",

        gap: 0.9,

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 1.8,

        bgcolor: "background.paper",

        transition: "0.2s ease",

        "&:hover": {
          borderColor:
            "primary.light",
        },
      }}
    >
      {/* AVATAR */}

      <Avatar
        sx={{
          width: 34,
          height: 34,
          minWidth: 34,

          bgcolor:
            "secondary.light",

          color: "primary.main",

          fontWeight: 700,

          fontSize: 12,
        }}
      >
        {name
          ?.charAt(0)
          ?.toUpperCase() || (
          <PersonOutline />
        )}
      </Avatar>

      {/* REVIEW */}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* NAME + DATE */}

        <Box
          sx={{
            display: "flex",

            alignItems: {
              xs: "flex-start",
              sm: "center",
            },

            justifyContent:
              "space-between",

            gap: 0.8,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 11.5,

                color: "text.primary",

                overflow: "hidden",
                textOverflow:
                  "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,

                mt: 0.15,
              }}
            >
              <Rating
                value={Number(
                  review?.rating || 0
                )}
                readOnly
                size="small"
                sx={{
                  fontSize: 15,
                }}
              />

              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 600,

                  color:
                    "text.secondary",
                }}
              >
                {Number(
                  review?.rating || 0
                ).toFixed(1)}
              </Typography>
            </Box>
          </Box>

          {reviewDate && (
            <Typography
              sx={{
                fontSize: 9,
                color:
                  "text.secondary",

                whiteSpace: "nowrap",

                flexShrink: 0,
              }}
            >
              {reviewDate}
            </Typography>
          )}
        </Box>

        {/* FEEDBACK TEXT */}

        <Typography
          sx={{
            mt: 0.6,

            fontSize: 10.8,

            lineHeight: 1.55,

            color: "text.secondary",

            wordBreak: "break-word",
          }}
        >
          {review?.feedback_text ||
            "No feedback provided."}
        </Typography>
      </Box>
    </Box>
  );
}