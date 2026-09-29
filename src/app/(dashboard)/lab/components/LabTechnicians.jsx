"use client";

import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { SectionTitle } from "./LabUi";

export default function LabTechnicians({ technicians = [], loading = false, onCreate }) {
  const [form, setForm] = useState({ fullName: "", email: "", phoneNumber: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await onCreate(form);
      setForm({ fullName: "", email: "", phoneNumber: "" });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Unable to add technician.");
    } finally {
      setSaving(false);
    }
  };

  return (
  <Box sx={{ height:"85vh", width: "100%" }}>
  <SectionTitle
    title="Assigned Lab Technicians"
    description="Add technicians who will receive assigned test work by email and manage it from their dashboard."
  />

  {/* ADD TECHNICIAN */}
  <Paper
    component="form"
    onSubmit={submit}
    elevation={0}
    sx={{
      mt: 1.5,
      mb: 2,
      border: "1px solid #E3EBE7",
      borderRadius: "10px",
      bgcolor: "#FFFFFF",
      overflow: "hidden",
    }}
  >
    {/* Form header */}
    <Box
      sx={{
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        bgcolor: "#F8FBFA",
        borderBottom: "1px solid #E7EEEA",
      }}
    >
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#172033",
        }}
      >
        Add technician
      </Typography>

      <Typography
        sx={{
          mt: 0.2,
          fontSize: "10.5px",
          color: "#7A8A84",
        }}
      >
        Enter technician contact details below.
      </Typography>
    </Box>

    <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
      {error ? (
        <Alert
          severity="error"
          sx={{
            mb: 1.5,
            py: 0.2,
            borderRadius: "7px",
            fontSize: "11px",
          }}
        >
          {error}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "1.1fr 1.3fr 1fr auto",
          },
          gap: 1.2,
          alignItems: "start",

          "& .MuiOutlinedInput-root": {
            height: 38,
            bgcolor: "#FFFFFF",
            borderRadius: "7px",

            "& fieldset": {
              borderColor: "#D7E1DD",
            },

            "&:hover fieldset": {
              borderColor: "#B7C8C1",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#07876A",
              borderWidth: "1px",
            },
          },

          "& .MuiInputBase-input": {
            fontSize: "11.5px",
            color: "#334155",
          },

          "& .MuiInputLabel-root": {
            fontSize: "11px",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#07876A",
          },
        }}
      >
        <TextField
          fullWidth
          size="small"
          label="Full name"
          value={form.fullName}
          required
          onChange={(event) =>
            setForm({
              ...form,
              fullName: event.target.value,
            })
          }
        />

        <TextField
          fullWidth
          size="small"
          type="email"
          label="Email address"
          value={form.email}
          required
          onChange={(event) =>
            setForm({
              ...form,
              email: event.target.value,
            })
          }
        />

        <TextField
          fullWidth
          size="small"
          label="Mobile number"
          value={form.phoneNumber}
          required
          inputProps={{ maxLength: 10 }}
          onChange={(event) =>
            setForm({
              ...form,
              phoneNumber: event.target.value,
            })
          }
        />

        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{
            height: 38,
            minWidth: { xs: "100%", lg: 125 },
            px: 1.8,

            bgcolor: "#07876A",
            borderRadius: "7px",

            fontSize: "10.5px",
            fontWeight: 700,
            textTransform: "none",

            whiteSpace: "nowrap",
            boxShadow: "none",

            "&:hover": {
              bgcolor: "#066F58",
              boxShadow: "none",
            },

            "&.Mui-disabled": {
              bgcolor: "#DDE8E3",
              color: "#82918B",
            },
          }}
        >
          {saving ? (
            <CircularProgress
              size={17}
              color="inherit"
            />
          ) : (
            "Add technician"
          )}
        </Button>
      </Box>
    </Box>
  </Paper>

  {/* TECHNICIANS LIST */}
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #E3EBE7",
      borderRadius: "10px",
      bgcolor: "#FFFFFF",
      overflow: "hidden",
    }}
  >
    {/* List heading */}
    <Box
      sx={{
        minHeight: 44,
        px: { xs: 1.5, sm: 2 },

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        bgcolor: "#FAFCFB",
        borderBottom: "1px solid #E7EEEA",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "11.5px",
            fontWeight: 700,
            color: "#172033",
          }}
        >
          Technicians
        </Typography>

        <Typography
          sx={{
            mt: 0.1,
            fontSize: "9.5px",
            color: "#84918C",
          }}
        >
          Currently assigned to this lab
        </Typography>
      </Box>

      {!loading ? (
        <Box
          sx={{
            minWidth: 26,
            height: 22,
            px: 0.7,

            display: "grid",
            placeItems: "center",

            bgcolor: "#EDF7F2",
            border: "1px solid #D8EBE3",
            borderRadius: "5px",

            fontSize: "9.5px",
            fontWeight: 700,
            color: "#07876A",
          }}
        >
          {technicians.length}
        </Box>
      ) : null}
    </Box>

    {/* LOADING */}
    {loading ? (
      <Box
        sx={{
          minHeight: 100,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress
          size={22}
          sx={{ color: "#07876A" }}
        />
      </Box>
    ) : technicians.length ? (
      <Box>
        {technicians.map((technician, index) => (
          <Box
            key={technician.email}
            sx={{
              minHeight: 58,

              px: { xs: 1.5, sm: 2 },
              py: 1,

              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              gap: {
                xs: 0.5,
                sm: 1.5,
              },

              borderBottom:
                index === technicians.length - 1
                  ? "none"
                  : "1px solid #EDF1EF",

              transition: "background 0.15s ease",

              "&:hover": {
                bgcolor: "#FAFCFB",
              },
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: 34,
                height: 34,

                display: {
                  xs: "none",
                  sm: "grid",
                },
                placeItems: "center",

                flexShrink: 0,

                bgcolor: "#EDF7F2",
                border: "1px solid #D8EBE3",
                borderRadius: "8px",

                color: "#07876A",

                fontSize: "11px",
                fontWeight: 750,
                textTransform: "uppercase",
              }}
            >
              {technician.full_name
                ?.trim()
                ?.charAt(0) || "T"}
            </Box>

            {/* NAME */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: 190,
                },
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "#172033",

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {technician.full_name}
              </Typography>

              <Typography
                sx={{
                  mt: 0.15,
                  fontSize: "9px",
                  color: "#8A9892",
                }}
              >
                Lab Technician
              </Typography>
            </Box>

            {/* EMAIL */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "9px",
                  fontWeight: 600,
                  color: "#94A3B8",
                  mb: 0.15,
                }}
              >
                EMAIL
              </Typography>

              <Typography
                sx={{
                  fontSize: "10.5px",
                  color: "#475569",

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {technician.email}
              </Typography>
            </Box>

            {/* MOBILE */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: 150,
                },
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "9px",
                  fontWeight: 600,
                  color: "#94A3B8",
                  mb: 0.15,
                }}
              >
                MOBILE
              </Typography>

              <Typography
                sx={{
                  fontSize: "10.5px",
                  color: "#475569",
                }}
              >
                {technician.phone_number}
              </Typography>
            </Box>

            {/* STATUS */}
            <Box
              sx={{
                px: 0.8,
                py: 0.35,

                flexShrink: 0,

                bgcolor: "#EDF7F2",
                borderRadius: "5px",

                fontSize: "8.5px",
                fontWeight: 700,
                color: "#07876A",
              }}
            >
              Assigned
            </Box>
          </Box>
        ))}
      </Box>
    ) : (
      /* EMPTY STATE */
      <Box
        sx={{
          minHeight: 110,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          px: 2,
          py: 2,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,

            display: "grid",
            placeItems: "center",

            mb: 0.7,

            bgcolor: "#F1F6F4",
            borderRadius: "8px",

            fontSize: "12px",
            fontWeight: 750,
            color: "#7C9088",
          }}
        >
          0
        </Box>

        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 650,
            color: "#475569",
          }}
        >
          No technicians added yet
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontSize: "9.5px",
            color: "#94A3B8",
          }}
        >
          Add your first technician using the form above.
        </Typography>
      </Box>
    )}
  </Paper>
</Box>
  );
}
