"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

export default function AssignQrDialog({
  open,
  onClose,
  doctor,
  onAssign,
  loading = false,
}) {
  const [qrInput, setQrInput] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [error, setError] = useState("");

  // Dialog open/change hone par reset
  useEffect(() => {
    if (open) {
      setQrInput("");
      setQrCodes([]);
      setError("");
    }
  }, [open, doctor?.userId]);

  const addQrCode = () => {
    const value = qrInput.trim();

    if (!value) return;

    if (qrCodes.includes(value)) {
      setError("This QR Code is already added.");
      return;
    }

    setQrCodes((prev) => [...prev, value]);

    setQrInput("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addQrCode();
    }

    // comma se bhi separate kar sakte ho
    if (e.key === ",") {
      e.preventDefault();
      addQrCode();
    }
  };

  const handleRemoveQr = (qrCode) => {
    setQrCodes((prev) =>
      prev.filter((item) => item !== qrCode)
    );

    setError("");
  };

  const handleAssign = () => {
    // Agar input me QR likha hai but Enter nahi kiya
    // to Assign click par usko bhi include kar do.
    const currentInput = qrInput.trim();

    let finalQrCodes = [...qrCodes];

    if (
      currentInput &&
      !finalQrCodes.includes(currentInput)
    ) {
      finalQrCodes.push(currentInput);
    }

    if (finalQrCodes.length === 0) {
      setError("Please add at least one QR Code.");
      return;
    }

    onAssign?.(finalQrCodes);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          width: "520px",
          maxWidth: "calc(100% - 24px)",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #DDE7E3",
          boxShadow:
            "0 20px 60px rgba(16,24,40,0.16)",
        },
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          px: 2.2,
          py: 1.8,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          bgcolor: "#F4FAF7",

          borderBottom: "1px solid #E1E9E6",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.1,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "9px",

              bgcolor: "#E2F4ED",
              color: "#07876A",
            }}
          >
            <QrCode2OutlinedIcon
              sx={{ fontSize: 20 }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                color: "#172033",
              }}
            >
              Assign QR Codes
            </Typography>

            <Typography
              sx={{
                mt: 0.1,
                fontSize: 10.5,
                color: "#7A8783",
              }}
            >
              Connect QR codes with this doctor
            </Typography>
          </Box>
        </Box>

        <IconButton
          disabled={loading}
          onClick={onClose}
          sx={{
            width: 32,
            height: 32,

            border: "1px solid #DDE7E3",
            bgcolor: "#FFFFFF",

            "&:hover": {
              bgcolor: "#EAF7F2",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 2.2,
        }}
      >
        {/* ================= DOCTOR ================= */}

        <Box
          sx={{
            mb: 2,

            px: 1.4,
            py: 1.1,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            border: "1px solid #E4EAE8",
            borderRadius: "8px",

            bgcolor: "#FAFCFB",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 9.5,
                color: "#8A9692",
              }}
            >
              Assigning to
            </Typography>

            <Typography
              sx={{
                mt: 0.15,
                fontSize: 12,
                fontWeight: 600,
                color: "#34423E",
              }}
            >
              {doctor?.name || "Doctor"}
            </Typography>
          </Box>

          <Typography
            sx={{
              px: 1,
              py: 0.45,

              borderRadius: "5px",

              bgcolor: "#EAF7F2",
              color: "#07876A",

              fontSize: 9.5,
              fontWeight: 600,
            }}
          >
            ID #{doctor?.userId || "-"}
          </Typography>
        </Box>

        {/* ================= INPUT ================= */}

        <Typography
          sx={{
            mb: 0.6,
            fontSize: 11.5,
            fontWeight: 600,
            color: "#34423E",
          }}
        >
          QR Code
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 0.8,
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={qrInput}
            disabled={loading}
            onChange={(e) => {
              setQrInput(e.target.value);

              if (error) {
                setError("");
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter QR code and press Enter"
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 40,

                borderRadius: "7px",

                bgcolor: "#FFFFFF",

                fontSize: 12,

                "& fieldset": {
                  borderColor: "#DCE5E2",
                },

                "&:hover fieldset": {
                  borderColor: "#9CCABE",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#07876A",
                  borderWidth: "1px",
                },
              },
            }}
          />

          <IconButton
            disabled={!qrInput.trim() || loading}
            onClick={addQrCode}
            sx={{
              width: 40,
              height: 40,

              flexShrink: 0,

              borderRadius: "7px",

              bgcolor: "#07876A",
              color: "#FFFFFF",

              "&:hover": {
                bgcolor: "#066F58",
              },

              "&.Mui-disabled": {
                bgcolor: "#DDE7E3",
                color: "#9AA6A2",
              },
            }}
          >
            <AddRoundedIcon
              sx={{ fontSize: 20 }}
            />
          </IconButton>
        </Box>

        <Typography
          sx={{
            mt: 0.6,
            fontSize: 9.5,
            color: "#8A9692",
          }}
        >
          Press Enter or comma after each QR code.
        </Typography>

        {/* ================= ERROR ================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 1.3,
              py: 0,

              borderRadius: "7px",

              "& .MuiAlert-message": {
                fontSize: 10.5,
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* ================= QR CHIPS ================= */}

        <Box
          sx={{
            mt: 2,

            minHeight: 100,

            p: 1.3,

            border: "1px dashed #C9D8D3",
            borderRadius: "9px",

            bgcolor: "#FBFDFC",
          }}
        >
          <Box
            sx={{
              mb: 1,

              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 600,
                color: "#596762",
              }}
            >
              Added QR Codes
            </Typography>

            {qrCodes.length > 0 && (
              <Typography
                sx={{
                  px: 0.8,
                  py: 0.2,

                  bgcolor: "#EAF7F2",
                  color: "#07876A",

                  borderRadius: "10px",

                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                {qrCodes.length}
              </Typography>
            )}
          </Box>

          {qrCodes.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.7,
              }}
            >
              {qrCodes.map((qrCode) => (
                <Chip
                  key={qrCode}
                  label={qrCode}
                  onDelete={
                    loading
                      ? undefined
                      : () =>
                          handleRemoveQr(qrCode)
                  }
                  sx={{
                    height: 29,

                    bgcolor: "#EAF7F2",
                    color: "#08745D",

                    border: "1px solid #C9E7DD",

                    borderRadius: "6px",

                    fontSize: 10.5,
                    fontWeight: 600,

                    "& .MuiChip-label": {
                      px: 1,
                    },

                    "& .MuiChip-deleteIcon": {
                      fontSize: 16,
                      color: "#6C8D83",

                      "&:hover": {
                        color: "#D14343",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                minHeight: 55,

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QrCode2OutlinedIcon
                sx={{
                  mb: 0.4,
                  fontSize: 22,
                  color: "#B8C5C1",
                }}
              />

              <Typography
                sx={{
                  fontSize: 10.5,
                  color: "#9AA6A2",
                }}
              >
                No QR codes added yet
              </Typography>
            </Box>
          )}
        </Box>

        {/* ================= FOOTER ================= */}

        <Box
          sx={{
            mt: 2.2,

            display: "flex",
            justifyContent: "flex-end",

            gap: 0.8,
          }}
        >
          <Button
            disabled={loading}
            onClick={onClose}
            sx={{
              height: 36,
              px: 1.7,

              border: "1px solid #DCE5E2",
              borderRadius: "7px",

              color: "#65736F",

              fontSize: 11,
              fontWeight: 600,

              textTransform: "none",

              "&:hover": {
                bgcolor: "#F6F8F7",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={
              loading ||
              (qrCodes.length === 0 &&
                !qrInput.trim())
            }
            onClick={handleAssign}
            startIcon={
              loading ? (
                <CircularProgress
                  size={14}
                  sx={{ color: "inherit" }}
                />
              ) : (
                <CheckCircleOutlineRoundedIcon
                  sx={{
                    fontSize:
                      "16px !important",
                  }}
                />
              )
            }
            sx={{
              height: 36,
              px: 1.8,

              borderRadius: "7px",

              bgcolor: "#07876A",
              color: "#FFFFFF",

              fontSize: 11,
              fontWeight: 600,

              textTransform: "none",
              boxShadow: "none",

              "&:hover": {
                bgcolor: "#066F58",
                boxShadow: "none",
              },
            }}
          >
            {loading
              ? "Assigning..."
              : `Assign QR${
                  qrCodes.length > 1 ? "s" : ""
                }`}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}