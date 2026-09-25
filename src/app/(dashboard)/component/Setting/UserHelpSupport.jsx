"use client";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import IconButton from "@mui/material/IconButton";

export default function UserHelpSupport() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const [successDialog, setSuccessDialog] = useState({
    open: false,
    type: "",
  });
  const [supportForm, setSupportForm] = useState({
    subject: "",
    message: "",
  });

  const [reportForm, setReportForm] = useState({
    issueType: "",
    description: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const cardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
    boxShadow: "none",
    bgcolor: "background.paper",
  };

  const iconBoxSx = {
    width: 40,
    height: 40,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    bgcolor: "rgba(7,135,106,0.08)",
    color: "primary.main",
  };

  const titleSx = {
    fontSize: "13px",
    fontWeight: 600,
    color: "text.primary",
  };

  const descriptionSx = {
    mt: 0.3,
    fontSize: "12.5px",
    lineHeight: 1.55,
    color: "text.secondary",
  };

  const buttonSx = {
    textTransform: "none",
    fontSize: "12.5px",
    fontWeight: 600,
    borderRadius: 1.5,
    whiteSpace: "nowrap",
  };

const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: "12.5px",
    color: "#596575",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },

  "& .MuiOutlinedInput-root": {
    fontSize: "12.5px",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",

    "& fieldset": {
      borderColor: "#B8C1BF",
    },

    "&:hover fieldset": {
      borderColor: "#9EA9A6",
    },

    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      borderWidth: "1px",
    },
  },

  "& .MuiInputBase-input": {
    fontSize: "12.5px",
    color: "text.primary",
  },

  "& .MuiInputBase-input::placeholder": {
    color: "#8A94A3",
    opacity: 1,
  },

  "& .MuiInputBase-inputMultiline": {
    fontSize: "12.5px",
  },
};

  const handleSupportSubmit = async () => {
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    try {
      setSupportLoading(true);

      // Yahan actual API call lagana hai
      // await axios.post("/api/support", supportForm);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSupportForm({
        subject: "",
        message: "",
      });

      setSupportOpen(false);

      setSuccessDialog({
        open: true,
        type: "support",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Unable to submit your request. Please try again.",
        severity: "error",
      });
    } finally {
      setSupportLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportForm.issueType || !reportForm.description.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    try {
      setReportLoading(true);

      // Yahan actual API call lagana hai
      // await axios.post("/api/report-issue", reportForm);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setReportForm({
        issueType: "",
        description: "",
      });

      setReportOpen(false);

      setSuccessDialog({
        open: true,
        type: "report",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Unable to submit your issue. Please try again.",
        severity: "error",
      });
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <Card sx={cardSx}>
          <CardContent
            sx={{
              p: { xs: 2, sm: 2.2 },
              "&:last-child": {
                pb: { xs: 2, sm: 2.2 },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box sx={iconBoxSx}>
                  <SupportAgentOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>

                <Box>
                  <Typography sx={titleSx}>Contact Support</Typography>

                  <Typography sx={descriptionSx}>
                    Get help with your account, appointments, documents, lab
                    reports or other Jeevan Dev services.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                onClick={() => setSupportOpen(true)}
                sx={{
                  ...buttonSx,
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              >
                Contact Support
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card sx={cardSx}>
          <CardContent
            sx={{
              p: { xs: 2, sm: 2.2 },
              "&:last-child": {
                pb: { xs: 2, sm: 2.2 },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box sx={iconBoxSx}>
                  <ReportProblemOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>

                <Box>
                  <Typography sx={titleSx}>Report an Issue</Typography>

                  <Typography sx={descriptionSx}>
                    Found a problem with Jeevan Dev? Report an appointment,
                    document, lab report, account or technical issue.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                onClick={() => setReportOpen(true)}
                sx={{
                  ...buttonSx,
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              >
                Report an Issue
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      <Dialog
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2.5,
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              Contact Support
            </Typography>

            <Typography sx={descriptionSx}>
              Tell us how we can help you.
            </Typography>
          </Box>

          <IconButton size="small" onClick={() => setSupportOpen(false)}>
            <CloseRoundedIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent
  sx={{
    px: 2.5,
    pt: "24px !important",
    pb: 2.5,
  }}
>
          <Stack spacing={2}>
            <TextField
              label="Subject"
              placeholder="Enter subject"
              fullWidth
              required
              value={supportForm.subject}
              onChange={(e) =>
                setSupportForm((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
              InputLabelProps={{
                shrink: true,
              }}
           sx={{
  ...fieldSx,
}}
            />
            <TextField
              label="Message"
              placeholder="Describe how we can help you..."
              fullWidth
              required
              multiline
              minRows={4}
              value={supportForm.message}
              onChange={(e) =>
                setSupportForm((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldSx}
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,
            pb: 2.5,
          }}
        >
          <Button
            variant="text"
            onClick={() => setSupportOpen(false)}
            sx={buttonSx}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSupportSubmit}
            disabled={supportLoading}
            startIcon={
              supportLoading ? (
                <CircularProgress size={15} color="inherit" />
              ) : null
            }
            sx={{
              ...buttonSx,
              minWidth: 130,
              boxShadow: "none",
            }}
          >
            {supportLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2.5,
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              Report an Issue
            </Typography>

            <Typography sx={descriptionSx}>Tell us what went wrong.</Typography>
          </Box>

          <IconButton size="small" onClick={() => setReportOpen(false)}>
            <CloseRoundedIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </DialogTitle>

     <DialogContent
  sx={{
    px: 2.5,
    pt: "28px !important",
    pb: 2.5,
    overflow: "visible",
  }}
>
          <Stack spacing={2}>
          <TextField
  select
  label="Issue Type"
  fullWidth
  required
  value={reportForm.issueType}
  onChange={(e) =>
    setReportForm((prev) => ({
      ...prev,
      issueType: e.target.value,
    }))
  }
  InputLabelProps={{
    shrink: true,
  }}
  SelectProps={{
    displayEmpty: true,
  }}
  sx={fieldSx}
>
  <MenuItem value="" disabled>
    Select issue type
  </MenuItem>

  <MenuItem value="account">
    Account Issue
  </MenuItem>

  <MenuItem value="appointment">
    Appointment Issue
  </MenuItem>

  <MenuItem value="document">
    Document Issue
  </MenuItem>

  <MenuItem value="lab">
    Lab / Report Issue
  </MenuItem>

  <MenuItem value="payment">
    Payment Issue
  </MenuItem>

  <MenuItem value="technical">
    Technical Issue
  </MenuItem>

  <MenuItem value="other">
    Other
  </MenuItem>
</TextField>

            <TextField
  label="Describe the issue"
  placeholder="Describe what went wrong..."
  fullWidth
  required
  multiline
  minRows={3}
  value={reportForm.description}
  onChange={(e) =>
    setReportForm((prev) => ({
      ...prev,
      description: e.target.value,
    }))
  }
  InputLabelProps={{
    shrink: true,
  }}
  sx={fieldSx}
/>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,
            pb: 2.5,
          }}
        >
          <Button
            variant="text"
            onClick={() => setReportOpen(false)}
            sx={buttonSx}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleReportSubmit}
            disabled={reportLoading}
            startIcon={
              reportLoading ? (
                <CircularProgress size={15} color="inherit" />
              ) : null
            }
            sx={{
              ...buttonSx,
              minWidth: 125,
              boxShadow: "none",
            }}
          >
            {reportLoading ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={successDialog.open}
        onClose={() =>
          setSuccessDialog({
            open: false,
            type: "",
          })
        }
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            textAlign: "center",
          },
        }}
      >
        <DialogContent
          sx={{
            px: 3,
            py: 4,
          }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(7,135,106,0.08)",
              color: "primary.main",
            }}
          >
            <CheckCircleOutlineRoundedIcon
              sx={{
                fontSize: 32,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {successDialog.type === "support"
              ? "Request Submitted"
              : "Issue Reported"}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: "12.5px",
              lineHeight: 1.6,
              color: "text.secondary",
            }}
          >
            {successDialog.type === "support"
              ? "Your support request has been submitted successfully. Our support team will review your request and get back to you within 24 hours."
              : "Your issue has been reported successfully. Our support team will review the issue and get back to you within 24 hours."}
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              setSuccessDialog({
                open: false,
                type: "",
              })
            }
            sx={{
              mt: 2.5,
              minWidth: 100,
              textTransform: "none",
              fontSize: "12.5px",
              fontWeight: 600,
              borderRadius: 1.5,
              boxShadow: "none",
            }}
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
