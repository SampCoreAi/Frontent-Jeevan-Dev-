"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DashboardCard from "../../components/doctorReceptionistUser/NumberCard";
import AssistantProfileDialog from "../../components/doctorReceptionistUser/AssistantProfileDialog";
import UserDataGrid from "../../components/doctorReceptionistUser/UserDataGrid";

export default function UsersPage() {
  // =====================================================
  // STATE
  // =====================================================

  const [users, setUsers] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);

  // Add Assistant loading
  const [loading, setLoading] = useState(false);

  // Table loading
  const [usersLoading, setUsersLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  // =====================================================
  // SNACKBAR
  // =====================================================

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // =====================================================
  // FETCH ASSISTANTS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/getUserByDoctorAssistant`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userArray = res?.data?.data || [];

      const formattedUsers = userArray.map((u, index) => ({
        id: u.id,
        sr: index + 1,
        name: u.full_name || "-",
        email: u.email || "-",
        mobile: u.phone_number || "-",
        gender: u.gender || "-",
        age: u.age || "-",
        department: u.department || "-",
        education: u.education || "-",
        experience: u.experience || "-",
        bio: u.bio || "-",
        image: u.image || "",
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching assistants:", err);

      showSnackbar(
        err?.response?.data?.message || "Failed to fetch assistants",
        "error"
      );
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (!/^[A-Za-z0-9_\-\s]+$/.test(value)) {
          error =
            "Only letters, numbers, spaces, _ and - are allowed";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Invalid email";
        }
        break;

      case "mobile":
        if (!value.trim()) {
          error = "Mobile number required";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Enter 10 digit mobile number";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);

      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "name"
        ? value.replace(/\b\w/g, (char) => char.toUpperCase())
        : value.trimStart();

    setForm((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formattedValue),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // =====================================================
  // ADD ASSISTANT
  // =====================================================

  const handleAddUser = async () => {
    if (!validateForm()) return;

    const payload = {
      full_name: form.name.trim(),
      email: form.email.trim(),
      phone_number: form.mobile.trim(),
      role_id: 3,
    };

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/assistant-register`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchUsers();

      showSnackbar("Assistant created successfully", "success");

      setDialogOpen(false);

      setForm({
        name: "",
        email: "",
        mobile: "",
      });

      setErrors({});
    } catch (err) {
      console.error("Create assistant error:", err);

      const message =
        err?.response?.data?.message ||
        "Failed to create assistant";

      if (message.toLowerCase().includes("email")) {
        setErrors((prev) => ({
          ...prev,
          email: message,
        }));
      } else {
        showSnackbar(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    setDialogOpen(false);

    setForm({
      name: "",
      email: "",
      mobile: "",
    });

    setErrors({});
  };

  // =====================================================
  // DATAGRID COLUMNS
  // =====================================================

  const columns = [
    {
      field: "sr",
      headerName: "SR",
      minWidth: 60,
      flex: 0.35,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 210,
      flex: 1.4,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      minWidth: 130,
      flex: 0.9,
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 120,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={
            <VisibilityIcon
              sx={{
                fontSize: "15px !important",
              }}
            />
          }
          onClick={() => {
            setSelectedAssistant(params.row);
            setViewOpen(true);
          }}
          sx={{
            minWidth: 78,
            px: 1.4,
          }}
        >
          View
        </Button>
      ),
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        mt: { xs: 6, sm: 7.5 },
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 3},
          bgcolor: "background.paper",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 1.5,
            my: 1,
            mx: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "text.primary",
                fontWeight: 700,
              }}
            >
              User Management
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.25,
                color: "text.secondary",
              }}
            >
              Manage your assistants
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            sx={{
              px: 2,
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            + Add Assistant
          </Button>
        </Box>

        {/* =================================================
            DASHBOARD CARD
        ================================================= */}

        <Box sx={{ my: 4 }}>
          <DashboardCard />
        </Box>

        {/* =================================================
            USER TABLE
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            position: "relative",
          }}
        >
          {usersLoading ? (
            <Box
              sx={{
                minHeight: 260,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <CircularProgress size={24} />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Loading assistants...
              </Typography>
            </Box>
          ) : users.length === 0 ? (
            <Box
              sx={{
                minHeight: 260,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  bgcolor: "secondary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "22px",
                  }}
                >
                  👤
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                sx={{
                  color: "text.primary",
                  fontWeight: 700,
                }}
              >
                No assistants found
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.4,
                  color: "text.secondary",
                }}
              >
                Add your first assistant to get started.
              </Typography>

              <Button
                variant="contained"
                size="small"
                onClick={() => setDialogOpen(true)}
                sx={{
                  mt: 1.5,
                }}
              >
                + Add Assistant
              </Button>
            </Box>
          ) : (
            <UserDataGrid
              users={users}
              columns={columns}
              loading={usersLoading}
            />
          )}
        </Box>

        {/* =================================================
            ADD ASSISTANT DIALOG
        ================================================= */}

        <Dialog
          open={dialogOpen}
          onClose={loading ? undefined : handleCancel}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              m: { xs: 1.5, sm: 2 },
              width: {
                xs: "calc(100% - 24px)",
                sm: "100%",
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            Add Assistant
          </DialogTitle>

          <DialogContent>
            <Grid
              container
              spacing={1.5}
              sx={{
                mt: 0.5,
              }}
            >
              {/* NAME */}

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name}
                  autoComplete="name"
                />
              </Grid>

              {/* EMAIL */}

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                  autoComplete="email"
                />
              </Grid>

              {/* MOBILE */}

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                  }}
                  autoComplete="tel"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              onClick={handleCancel}
              variant="outlined"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleAddUser}
              disabled={loading}
              variant="contained"
              sx={{
                minWidth: 75,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={16}
                  sx={{
                    color: "primary.contrastText",
                  }}
                />
              ) : (
                "Add"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* =================================================
          PROFILE DIALOG
      ================================================= */}

      <AssistantProfileDialog
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedAssistant(null);
        }}
        assistant={selectedAssistant}
      />

      {/* =================================================
          SNACKBAR
      ================================================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={handleSnackbarClose}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}