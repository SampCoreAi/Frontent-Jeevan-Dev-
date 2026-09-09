import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";

export default function IDCard() {
  return (
    <Card
      sx={{
        width: { xs: "90%", sm: 500, md: 500 },
        borderRadius: 2,
        border: "10px solid #048082",
        mx: "auto",
        mt: 5,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 2, sm: 0 }, 
          }}
        >
          <Typography
            fontSize={{ xs: 20, sm: 25 }}
            borderLeft="6px solid #048082"
            fontWeight="900"
            paddingLeft={1}
          >
            JEEVAN DEV
          </Typography>
          <Avatar
            src="/img/icon.png"
            sx={{ width: { xs: 50, sm: 70 }, height: { xs: 50, sm: 70 } }}
            variant="square"
          />
        </Box>

        {/* Token number */}
        <Typography
          fontSize={{ xs: 18, sm: 25 }}
          align="center"
          fontWeight="bold"
          mt={2}
        >
          Your Token Number : 2686
        </Typography>

        <Box mt={3}>
          <Typography sx={{ fontSize: { xs: "1rem", sm: "1.4rem" }, mb: 1 }}>
            <strong>Name:</strong> Alex Johnson
          </Typography>
          <Typography sx={{ fontSize: { xs: "1rem", sm: "1.4rem" } }}>
            <strong>User ID:</strong> AJ12345
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
