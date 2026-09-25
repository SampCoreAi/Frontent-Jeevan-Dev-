"use client";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";

const Card = ({
  numberOfQR,
  setNumberOfQR,
  handleGenerateQR,
  generating,
}) => {
  const theme = useTheme();

  const handleChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setNumberOfQR("");
      return;
    }

    if (!/^\d+$/.test(value)) return;

    setNumberOfQR(value);
  };

  const isDisabled =
    generating ||
    !numberOfQR ||
    Number(numberOfQR) <= 0;

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 2, sm: 2.5 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",

        display: "flex",
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      {/* LEFT - Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${theme.palette.primary.main}12`,
            color: "primary.main",
          }}
        >
          <QrCode2RoundedIcon fontSize="small" />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: { xs: "15px", sm: "17px" },
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            Generate QR Codes
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: "12px",
              color: "text.secondary",
            }}
          >
            Enter the number of QR codes you want to generate.
          </Typography>
        </Box>
      </Box>

      {/* RIGHT - Input + Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          flexShrink: 0,

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          width: {
            xs: "100%",
            md: "auto",
          },
        }}
      >
        <TextField
          size="small"
          type="number"
          label="Number of QR"
          placeholder="Enter count"
          value={numberOfQR}
          disabled={generating}
          onChange={handleChange}
          inputProps={{
            min: 1,
            step: 1,
          }}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "."].includes(e.key)) {
              e.preventDefault();
            }

            if (e.key === "Enter" && !isDisabled) {
              handleGenerateQR();
            }
          }}
          sx={{
            width: {
              xs: "100%",
              sm: 180,
            },

            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
        />

        <Button
          variant="contained"
          disabled={isDisabled}
          onClick={handleGenerateQR}
          startIcon={
            generating ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <QrCode2RoundedIcon sx={{ fontSize: 19 }} />
            )
          }
          sx={{
            height: 40,
            minWidth: {
              xs: "100%",
              sm: 145,
            },
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            whiteSpace: "nowrap",

            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {generating ? "Generating..." : "Generate QR"}
        </Button>
      </Box>
    </Box>
  );
};

export default Card;