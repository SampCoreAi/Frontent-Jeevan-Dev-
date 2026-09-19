"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid } from "@mui/material";

import CardPage from "../Dashboard/CardPage";


const Page = () => {
  const [roleId, setRoleId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.push("/Home/pages/Login");
      return;
    }

    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role_id !== 1) {
        router.push("/Home/pages/Login");
      }
      setRoleId(parsedUser.role_id);
    }
  }, [router]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        mt: 9,
        px: { xs: 1, sm: 2 },
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: 1,
          p: 2,
          boxShadow: (theme) => `0 4px 12px ${theme.palette.border.third}`,
        }}
      >
        <Grid size={12}>
          <CardPage />
        </Grid>

      </Grid>
    </Box>
  );
};

export default Page;