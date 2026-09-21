
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DashboardCard from "../../components/doctorReceptionistUser/NumberCard";
import AssistantProfileDialog from "../../components/doctorReceptionistUser/AssistantProfileDialog";
import UserDataGrid from "../../components/doctorReceptionistUser/UserDataGrid";

const initialForm = {
  name: "",
  email: "",
  mobile: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("Authentication token not found", "error");
        return;
      }
      if (!apiUrl) {
        showSnackbar("API URL is not configured", "error");
        return;
      }
      const res = await axios.get(
        `${apiUrl}/api/auth/getUserByDoctorAssistant`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userArray = Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      const formattedUsers = userArray.map((user, index) => ({
        id: user.id,
        sr: index + 1,
        name: user.full_name || "-",
        email: user.email || "-",
        mobile: user.phone_number || "-",
        gender: user.gender || "-",
        age: user.age || "-",
        department: user.department || "-",
        education: user.education || "-",
        experience: user.experience || "-",
        bio: user.bio || "-",
        image: user.image || "",
      }));
      setUsers(formattedUsers);
    } catch (err) {
      showSnackbar(
        err?.response?.data?.message || "Failed to fetch assistants",
        "error"
      );
    } finally {
      setUsersLoading(false);
    }
  }, [apiUrl, showSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const validateField = (name, value) => {
    const trimmedValue = String(value || "").trim();
    if (name === "name") {
      if (!trimmedValue) return "Name is required";
      if (trimmedValue.length < 2) return "Name must be at least 2 characters";
      if (trimmedValue.length > 50) return "Name cannot exceed 50 characters";
      if (!/^[A-Za-z0-9_\-\s]+$/.test(trimmedValue)) {
        return "Only letters, numbers, spaces, _ and - are allowed";
      }
    }
    if (name === "email") {
      if (!trimmedValue) return "Email is required";
      if (trimmedValue.length > 100) return "Email is too long";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
        return "Enter a valid email address";
      }
    }
    if (name === "mobile") {
      if (!trimmedValue) return "Mobile number is required";
      if (!/^[6-9]\d{9}$/.test(trimmedValue)) {
        return "Enter a valid 10 digit mobile number";
      }
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "mobile") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }
    if (name === "name") {
      formattedValue = value
        .replace(/\s{2,}/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    if (name === "email") {
      formattedValue = value.replace(/\s/g, "").toLowerCase();
    }
    setForm((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, formattedValue),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
  };

  const handleCancel = () => {
    if (loading) return;
    setDialogOpen(false);
    resetForm();
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("Authentication token not found", "error");
      return;
    }
    if (!apiUrl) {
      showSnackbar("API URL is not configured", "error");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/api/auth/assistant-register`,
        {
          full_name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone_number: form.mobile.trim(),
          role_id: 3,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUsers();
      showSnackbar("Assistant created successfully");
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create assistant";
      if (message.toLowerCase().includes("email")) {
        setErrors((prev) => ({
          ...prev,
          email: message,
        }));
      } else if (message.toLowerCase().includes("phone")) {
        setErrors((prev) => ({
          ...prev,
          mobile: message,
        }));
      } else {
        showSnackbar(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "sr",
        headerName: "SR",
        minWidth: 55,
        flex: 0.3,
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
        minWidth: 200,
        flex: 1.4,
      },
      {
        field: "mobile",
        headerName: "Mobile",
        minWidth: 130,
        flex: 0.8,
      },
      {
        field: "action",
        headerName: "Action",
        minWidth: 100,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon sx={{ fontSize: "15px !important" }} />}
            onClick={() => {
              setSelectedAssistant(params.row);
              setViewOpen(true);
            }}
            sx={{
              minWidth: 76,
              height: 30,
              px: 1.25,
              fontSize: "12.5px",
              textTransform: "none",
              borderRadius: 1,
            }}
          >
            View
          </Button>
        ),
      },
    ],
    []
  );

  const fieldSx = {
    "& .MuiInputBase-root": {
      fontSize: "12.5px",
      bgcolor: "background.default",
    },
    "& .MuiInputLabel-root": {
      fontSize: "12.5px",
    },
    "& .MuiFormHelperText-root": {
      fontSize: "11px",
      mx: 0.25,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        mt: { xs: 6, sm: 8 },
        bgcolor: "background.default",
        fontSize: "12.5px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            px: { xs: 1.5, sm: 4 },
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.4,
              }}
            >
              User Management
            </Typography>
            <Typography
              sx={{
                mt: 0.25,
                fontSize: "12.5px",
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
              minHeight: 34,
              px: 1.75,
              width: { xs: "100%", sm: "auto" },
              fontSize: "12.5px",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 1,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            + Add Assistant
          </Button>
        </Box>
        <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 2 }}>
          <DashboardCard />
        </Box>
        <Box
          sx={{
            width: "100%",
            px: { xs: 1, sm: 2 },
            pb: 2,
            overflowX: "auto",
          }}
        >
          {usersLoading ? (
            <Box
              sx={{
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <CircularProgress size={22} />
              <Typography
                sx={{
                  fontSize: "12.5px",
                  color: "text.secondary",
                }}
              >
                Loading assistants...
              </Typography>
            </Box>
          ) : users.length === 0 ? (
            <Box
              sx={{
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  mb: 1,
                }}
              >
                <PersonOutlineIcon
                  sx={{
                    fontSize: 22,
                    color: "primary.main",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                No assistants found
              </Typography>
              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: "12.5px",
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
                  fontSize: "12.5px",
                  textTransform: "none",
                  boxShadow: "none",
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
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={loading ? undefined : handleCancel}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            m: { xs: 1.5, sm: 2 },
            width: { xs: "calc(100% - 24px)", sm: "100%" },
            borderRadius: 1.5,
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.5,
            fontSize: "14px",
            fontWeight: 700,
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          Add Assistant
        </DialogTitle>
        <DialogContent
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: "20px !important",
          }}
        >
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name || " "}
                autoComplete="name"
                inputProps={{ maxLength: 50 }}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                size="small"
                error={!!errors.email}
                helperText={errors.email || " "}
                autoComplete="email"
                inputProps={{ maxLength: 100 }}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                size="small"
                error={!!errors.mobile}
                helperText={errors.mobile || " "}
                autoComplete="tel"
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                }}
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.5,
            gap: 0.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={handleCancel}
            variant="outlined"
            disabled={loading}
            sx={{
              fontSize: "12.5px",
              textTransform: "none",
              minWidth: 75,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            disabled={loading}
            variant="contained"
            sx={{
              fontSize: "12.5px",
              textTransform: "none",
              minWidth: 75,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={16}
                sx={{ color: "primary.contrastText" }}
              />
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <AssistantProfileDialog
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedAssistant(null);
        }}
        assistant={selectedAssistant}
      />
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
          sx={{ fontSize: "12.5px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
