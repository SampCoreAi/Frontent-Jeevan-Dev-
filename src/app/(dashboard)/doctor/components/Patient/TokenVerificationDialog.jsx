"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

export default function TokenVerificationDialog({
  open,
  token,
  error,
  loading,
  onTokenChange,
  onErrorClear,
  onClose,
  onVerify,
}) {
  const theme = useTheme();

  const fieldStyle = {
    "& .MuiInputLabel-root": {
      fontSize: "13px",
      color: theme.palette.text.secondary,
    },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      transform: "translate(14px, -5px) scale(0.75)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
    },
    "& .MuiOutlinedInput-root": {
      height: 40,
      fontSize: "13px",
      bgcolor: theme.palette.background.paper,
      "& fieldset": {
        borderColor: "#D8DEDC",
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },
    },
    "& input": {
      fontSize: "13px",
      color: theme.palette.text.primary,
    },
  };

  const handleChange = (event) => {
    onTokenChange(event.target.value.replace(/\s/g, ""));
    onErrorClear();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      token.trim() &&
      !loading
    ) {
      onVerify();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          m: { xs: 1.5, sm: 2 },
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 2,
          py: 1.5,
          fontSize: "13px",
          fontWeight: 700,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        Verify Appointment Token
      </DialogTitle>

      <DialogContent
        sx={{
          px: 2,
          pt: "16px !important",
          pb: 1,
        }}
      >
        <Typography
          sx={{
            mb: 1.5,
            fontSize: "12px",
            color: theme.palette.text.secondary,
          }}
        >
          Enter the patient token to start this appointment.
        </Typography>

        <TextField
          label="Token"
          fullWidth
          size="small"
          autoFocus
          value={token}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={Boolean(error)}
          helperText={error}
          inputProps={{
            maxLength: 100,
          }}
          sx={{
            ...fieldStyle,
            "& .MuiFormHelperText-root": {
              mx: 0,
              fontSize: "11px",
            },
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 2,
          py: 1.5,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            fontSize: "12px",
            textTransform: "none",
            color: theme.palette.text.secondary,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onVerify}
          disabled={!token.trim() || loading}
          sx={{
            minWidth: 90,
            fontSize: "12px",
            textTransform: "none",
            boxShadow: "none",
            bgcolor: theme.palette.primary.main,
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}