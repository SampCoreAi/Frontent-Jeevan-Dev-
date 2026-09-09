"use client";

import { Box, Button, TextField, Typography } from "@mui/material";

const Card = ({
  numberOfQR,
  setNumberOfQR,
  handleGenerateQR
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        textAlign="center"
        mb={3}
        fontWeight={600}
      >
        Generated QR
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography>
          Number of QR
        </Typography>

        <TextField
          size="small"
          type="number"
          value={numberOfQR}
          onChange={(e) => setNumberOfQR(e.target.value)}
          sx={{
            width: 120,
          }}
        />

        <Button
          variant="contained"
          onClick={handleGenerateQR}
          sx={{
            bgcolor: "#1E6658",
            "&:hover": {
              bgcolor: "#155044",
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Card;