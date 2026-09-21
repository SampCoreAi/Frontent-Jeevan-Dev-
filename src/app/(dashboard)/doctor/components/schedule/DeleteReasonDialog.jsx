import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  useTheme,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

export default function DeleteReasonDialog({
  open,
  title = "Delete",
  onClose,
  onSubmit,
}) {
  const theme = useTheme();

  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  const handleSubmit = () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) return;

    onSubmit(trimmedReason);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "10px",
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0 8px 28px rgba(0,0,0,0.10)",
        },
      }}
    >
      {/* HEADER */}

      <DialogTitle
        sx={{
          px: 2,
          py: 1.4,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontSize: "10.5px",
                color: theme.palette.text.secondary,
              }}
            >
              Please provide a reason before deleting.
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              width: 30,
              height: 30,
              flexShrink: 0,
              color: theme.palette.text.secondary,

              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* CONTENT */}

      <DialogContent
        sx={{
          px: 2,
          pt: "18px !important",
          pb: 1,
        }}
      >
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={3}
          size="small"
          label="Reason"
          placeholder="Enter reason for deletion..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "7px",
              fontSize: "12px",

              "& fieldset": {
                borderColor: theme.palette.divider,
              },

              "&:hover fieldset": {
                borderColor: theme.palette.error.main,
              },

              "&.Mui-focused fieldset": {
                borderColor: theme.palette.error.main,
                borderWidth: "1px",
              },
            },

            "& .MuiInputLabel-root": {
              fontSize: "12px",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.palette.error.main,
            },

            "& textarea": {
              fontSize: "12px",
              lineHeight: 1.5,
            },
          }}
        />
      </DialogContent>

      {/* ACTIONS */}

      <DialogActions
        sx={{
          px: 2,
          pt: 1,
          pb: 1.5,
          gap: 0.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 1.7,
            borderRadius: "6px",
            textTransform: "none",
            fontSize: "11.5px",
            color: theme.palette.text.secondary,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={!reason.trim()}
          onClick={handleSubmit}
          sx={{
            height: 32,
            minWidth: 75,
            px: 1.8,
            borderRadius: "6px",
            textTransform: "none",
            fontSize: "11.5px",
            fontWeight: 600,
            boxShadow: "none",

            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}