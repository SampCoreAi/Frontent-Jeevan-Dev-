"use client";
import React, { useEffect, useState } from "react";
import FeedbackCharts from './FeedbackChart'
import { Grid, Box } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import FeedbackCard from "./FeedbackCard";
import FeedbackList from "./FeedbackList";

const FeedbackContent = () => {
  const [token, setToken] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState({
    avg_rating: 0,
    total_feedbacks: 0,
    positive: 0,
    negative: 0,
  });
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    const getRatings = async () => {
      try {
       const res = await axios.get(`${API_URL}/api/feedback/ratings`);

        


        if (res.data.success && res.data.data.length > 0) {
          const apiData = res.data.data[0];

          setData({
            avg_rating: apiData.avg_rating,
            total_feedbacks: apiData.total_feedbacks,
            positive: apiData.
              positive_feedbacks
            ,
            negative: apiData.negative_feedbacks
            ,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRatings();
  }, []);

useEffect(() => {
  if (!token) return;

  const getFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      if (res.data.success) {
        setFeedbacks(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  getFeedbacks();
}, [token]);
  const cards = [
    {
      title: "Average Rating",
      value: data.avg_rating,
      icon: <StarIcon />,
    },
    {
      title: "Total Feedback",
      value: data.total_feedbacks,
      icon: <FormatListBulletedIcon />,
    },
    {
      title: "Positive Feedbacks",
      value: data.positive,
      icon: <ThumbUpAltIcon />,
    },
    {
      title: "Negative Feedbacks",
      value: data.negative,
      icon: <ThumbDownAltIcon />,
    },
  ];

  return (
    <Box sx={{ width: "100%", pt: 8.5, px: 1 }}>
      <Box
        sx={{
          boxShadow: "0 4px 12px rgba(15,116,104,0.3)",
          backgroundColor: "#fff",
          borderRadius: 1,
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <FeedbackCard {...card} />
            </Grid>
          ))}
        </Grid>
        <FeedbackCharts
          positive={data.positive}
          negative={data.negative}
        />
        <FeedbackList feedbacks={feedbacks} />
      </Box>
    </Box>
  );
};

export default FeedbackContent;