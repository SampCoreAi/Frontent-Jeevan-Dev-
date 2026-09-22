"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Pagination,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

const FeedbackList = ({ feedbacks = [] }) => {
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(feedbacks.length / itemsPerPage)
  );

  const startIndex = (page - 1) * itemsPerPage;

  const visibleFeedbacks = feedbacks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
        }}
      >
        {visibleFeedbacks.map((item) => {
          const dateTime = new Date(item.created_at).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                width: "100%",
                p: { xs: 1.5, sm: 1.8 },
                borderRadius: "10px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "rgba(15, 116, 104, 0.3)",
                  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
                },
              }}
            >
              <Stack
                direction="row"
                spacing={{ xs: 1.2, sm: 1.5 }}
                alignItems="flex-start"
              >
                <Avatar
                  sx={{
                    width: { xs: 38, sm: 42 },
                    height: { xs: 38, sm: 42 },
                    flexShrink: 0,
                    bgcolor: "#07876a",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {item?.full_name?.charAt(0)?.toUpperCase() || "A"}
                </Avatar>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "space-between",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 0.7, sm: 1 },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "12.5px",
                          fontWeight: 700,
                          lineHeight: 1.35,
                          color: "text.primary",
                        }}
                      >
                        {item?.full_name || "Anonymous"}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.25,
                          fontSize: "10.5px",
                          lineHeight: 1.4,
                          color: "text.secondary",
                        }}
                      >
                        {dateTime}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                        flexShrink: 0,
                      }}
                    >
                      <Rating
                        value={item.rating || 0}
                        readOnly
                        size="small"
                        sx={{
                          fontSize: "17px",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "text.secondary",
                        }}
                      >
                        {item.rating || 0}/5
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      mt: 1.2,
                      px: 1.4,
                      py: 1.1,
                      width: "100%",
                      borderRadius: "8px",
                      bgcolor: "#F8FAFC",
                      border: "1px solid",
                      borderColor: "#F1F5F9",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        lineHeight: 1.6,
                        color: "text.secondary",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.feedback_text}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Box>

      {feedbacks.length > itemsPerPage && (
        <Box
          sx={{
            mt: 2,
            pt: 1.5,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            size="small"
            color="primary"
            siblingCount={0}
            sx={{
              "& .MuiPaginationItem-root": {
                minWidth: 30,
                height: 30,
                borderRadius: "7px",
                fontSize: "11.5px",
                fontWeight: 600,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FeedbackList;