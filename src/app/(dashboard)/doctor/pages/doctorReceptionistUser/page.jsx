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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardCard from "../../components/doctorReceptionistUser/NumberCard";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import AssistantProfileDialog from "../../components/doctorReceptionistUser/AssistantProfileDialog";
import UserDataGrid from "../../components/doctorReceptionistUser/UserDataGrid";
export default function UsersPage() {
  // -------------------- Styles --------------------
  const inputStyles = {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1e6658",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#14503e",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1e6658",
    },
  };

  const labelStyles = {
    sx: {
      color: "#1e6658",
      "&.Mui-focused": { color: "#1e6658" },
      "&.MuiInputLabel-shrink": { color: "#1e6658" },
    },
  };
  const router = useRouter();
  // -------------------- State --------------------
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  // -------------------- API --------------------
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/getUserByDoctorAssistant`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const userArray = res.data.data || [];

      const formattedUsers = userArray.map((u, index) => ({
        id: u.id,
        sr: index + 1,
        name: u.full_name,
        email: u.email,
        mobile: u.phone_number,
        gender: u.gender,
        age: u.age,
        department: u.department,
        education: u.education,
        experience: u.experience,
        bio: u.bio,
        image: u.image,
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -------------------- Validation --------------------
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
     case "name":
  if (!value.trim()) {
    error = "Name is required";
  } else if (!/^[A-Za-z0-9_\-\s]+$/.test(value)) {
    error = "Only letters, numbers, spaces, _ and - are allowed";
  }
  break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value))
          error = "Invalid email";
        break;

      case "mobile":
        if (!value.trim()) error = "Mobile number required";
        else if (!/^\d{10}$/.test(value))
          error = "Enter 10 digit mobile number";
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

  // -------------------- Handlers --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "name"
        ? value.replace(/\b\w/g, (char) => char.toUpperCase())
        : value.trimStart();

    setForm({
      ...form,
      [name]: formattedValue,
    });

    setErrors({
      ...errors,
      [name]: validateField(name, formattedValue),
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };
  const handleAddUser = async () => {
    if (!validateForm()) return;

    const payload = {
      full_name: form.name,
      email: form.email,
      phone_number: form.mobile,
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

      setSuccessOpen(true);


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
    err.response?.data?.message || "Failed to create user";

  if (message.toLowerCase().includes("email")) {
    setErrors((prev) => ({
      ...prev,
      email: message,
    }));
  } else {
    alert(message);
  }
}finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setDialogOpen(false);

    setForm({
      name: "",
      email: "",
      mobile: "",
    });

    setErrors({});
  };

  // -------------------- DataGrid Columns --------------------
  const columns = [
    {
      field: "sr",
      headerName: "SR",
      minWidth: 70,
      flex: 0.4,
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
      minWidth: 220,
      flex: 1.5,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      minWidth: 140,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 140,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<VisibilityIcon />}
          sx={{
            bgcolor: "#1e6658",
            "&:hover": {
              bgcolor: "#14503e",
            },
          }}
          onClick={() => {
            setSelectedAssistant(params.row);
            setViewOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  // -------------------- UI --------------------
  return (
    <Box
      sx={{
        width: {
          xs: "42%",
          sm: "100%",
          md: "60%",
          lg: "100%",
          xl: "100%",

          "@media (min-width: 375px)": {
            width: "49%",
          },

          "@media (min-width: 425px)": {
            width: "56%",
          },

          "@media (min-width: 600px)": {
            width: "97%",
          },

          "@media (min-width: 900px)": {
            width: "60%",
          },

          "@media (min-width: 1024px)": {
            width: "94%",
          },

          "@media (min-width: 1140px)": {
            width: "100%",
          },
        },
        minHeight: "100vh",
        mt: { xs: 6, sm: 7.5 },
        p: { xs: 1, sm: 2, md: 1 },
        bgcolor: "#f5f7f9",

      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          backgroundColor: "#fff",
          borderRadius: 0.5,
          boxShadow: "0 4px 12px #0f7468",

        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1e6658",
              fontSize: {
                xs: "1.3rem",
                sm: "1.6rem",
              },
            }}
          >
            User Management
          </Typography>

          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            fullWidth={false}
            sx={{
              bgcolor: "#1e6658",
              "&:hover": {
                bgcolor: "#14503e",
              },
              px: 3,
              py: 1,
              fontWeight: 600,
              borderRadius: 2,
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            + Add Assistant
          </Button>
        </Box>

        {/* Cards */}
        <Box sx={{ mb: 3 }}>
          <DashboardCard />
        </Box>

        <UserDataGrid
          users={users}
          columns={columns}
        />

        {/* Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCancel}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add Assistant</DialogTitle>

          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {["name", "email", "mobile"].map((field) => (
                <Grid key={field} size={{ xs: 12 }}>
                  <TextField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={!!errors[field]}
                    helperText={errors[field]}
                    InputLabelProps={labelStyles}
                    InputProps={{
                      sx: inputStyles,
                    }}
                  />
                </Grid>

              ))}

            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              sx={{
                borderColor: "#1e6658",
                color: "#1e6658",
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleAddUser}
              disabled={loading}
              variant="contained"
              sx={{
                bgcolor: "#1e6658",
                "&:hover": {
                  bgcolor: "#14503e",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="white" />
              ) : (
                "Add"
              )}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
      <AssistantProfileDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        assistant={selectedAssistant}
      />
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success" variant="filled">
          User created successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}