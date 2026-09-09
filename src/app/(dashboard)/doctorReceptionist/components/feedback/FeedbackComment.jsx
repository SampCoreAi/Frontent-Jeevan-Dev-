import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Button,
  TextField,
  Collapse,
  Box,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReplyIcon from "@mui/icons-material/Reply";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function App() {
  const [feedbacks, setFeedbacks] = useState([
    {
      name: "John Doe",
      time: "10 min",
      date: "05-10-2025",
      comment:
        "Great work on the latest update! Really impressed with the UI changes.",
      replies: [],
    },
    {
      name: "Jane Smith",
      time: "1 hr",
      date: "05-10-2025",
      comment: "I noticed some performance issues when loading large datasets.",
      replies: [],
    },
    {
      comment: "Anonymous feedback here, no name provided.",
      replies: [],
    },
    {
      name: "Alice",
      time: "2 hrs",
      date: "05-10-2025",
      comment: "Loved the new dark mode feature!",
      replies: [],
    },
  ]);

  const [replyStates, setReplyStates] = useState({});
  const [replyTexts, setReplyTexts] = useState({});

  const toggleReply = (index) => {
    setReplyStates({ ...replyStates, [index]: !replyStates[index] });
  };

  const handleReplyChange = (index, text) => {
    setReplyTexts({ ...replyTexts, [index]: text });
  };

  const handleSendReply = (index) => {
    const text = replyTexts[index]?.trim();
    if (!text) return;

    const updated = [...feedbacks];
    updated[index].replies.push(text);

    setFeedbacks(updated);
    setReplyTexts({ ...replyTexts, [index]: "" });
    setReplyStates({ ...replyStates, [index]: false });
  };

 return (
  <Box sx={{ px: { xs: 1, sm: 0 }, py: 3 }}>
    <Typography
      variant="h4"
      sx={{
        mb: 3,
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontSize: { xs: 24, sm: 28, md: 30 },
        color: "#0f7468",
      }}
    >
      <ReceiptLongIcon sx={{ fontSize: 30 }} />
      Patient Feedbacks
    </Typography>

    <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
      {feedbacks.map((fb, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: 0.5,
              border: "1px solid #0f7468",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <CardContent>
              <Typography>
                {fb.comment}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);
}