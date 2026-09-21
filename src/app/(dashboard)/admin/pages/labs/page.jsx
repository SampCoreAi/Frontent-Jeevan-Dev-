"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Add, Refresh, ToggleOff, ToggleOn } from "@mui/icons-material";
import { API_BASE_URL } from "../../../../../config/api";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  labName: "",
  labCode: "",
  registrationNumber: "",
  address: "",
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function LabsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusLabId, setStatusLabId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [tableSearch, setTableSearch] = useState("");
  const [tableStatus, setTableStatus] = useState("");
  const [tableDate, setTableDate] = useState("");
  const [tablePage, setTablePage] = useState(1);

  const pageSize = 10;
  const columns = [
    "LAB",
    "OWNER",
    "CONTACT",
    "STATUS",
    "DOCTORS",
    "REQUESTS",
    "ACTION",
  ];

  const requestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    };
  };

  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${API_BASE_URL}/admin/getLabDetails`,
        {
          ...requestConfig(),
          params: {
            search: tableSearch.trim() || undefined,
            status: tableStatus || undefined,
            date: tableDate || undefined,
          },
        }
      );
      const data = response?.data?.data;
      setLabs(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setLabs([]);
      setError(
        getErrorMessage(requestError, "Unable to load labs.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLabs();
    }, tableSearch ? 350 : 0);

    return () => clearTimeout(timer);
  }, [tableSearch, tableStatus, tableDate]);

  useEffect(() => {
    setTablePage(1);
  }, [tableSearch, tableStatus, tableDate]);

  const stats = useMemo(() => {
    return {
      total: labs.length,
      active: labs.filter(
        (lab) => String(lab?.status).toUpperCase() === "ACTIVE"
      ).length,
      doctors: labs.reduce(
        (sum, lab) => sum + Number(lab?.doctor_count || 0),
        0
      ),
      requests: labs.reduce(
        (sum, lab) => sum + Number(lab?.request_count || 0),
        0
      ),
    };
  }, [labs]);

  const filteredLabs = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();

    return labs.filter((lab) => {
      const matchesSearch =
        !query ||
        [
          lab?.lab_name,
          lab?.lab_code,
          lab?.admin_name,
          lab?.email,
          lab?.phone_number,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );

      const matchesStatus =
        !tableStatus ||
        String(lab?.status).toUpperCase() === tableStatus;

      const matchesDate =
        !tableDate ||
        String(lab?.created_at || "").startsWith(tableDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [labs, tableSearch, tableStatus, tableDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLabs.length / pageSize)
  );

  const visibleLabs = useMemo(() => {
    const start = (tablePage - 1) * pageSize;
    return filteredLabs.slice(start, start + pageSize);
  }, [filteredLabs, tablePage]);

  useEffect(() => {
    if (tablePage > totalPages) {
      setTablePage(totalPages);
    }
  }, [tablePage, totalPages]);

  const validateForm = () => {
    const errors = {};
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const password = form.password;
    const phoneNumber = form.phoneNumber.trim();
    const labName = form.labName.trim();
    const labCode = form.labCode.trim();
    const registrationNumber = form.registrationNumber.trim();
    const address = form.address.trim();

    if (!fullName) {
      errors.fullName = "Lab owner name is required.";
    } else if (fullName.length < 2) {
      errors.fullName = "Name must be at least 2 characters.";
    } else if (fullName.length > 100) {
      errors.fullName = "Name must be under 100 characters.";
    }

    if (!email) {
      errors.email = "Owner email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Enter a valid email address.";
    } else if (email.length > 150) {
      errors.email = "Email is too long.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (password.length > 100) {
      errors.password = "Password is too long.";
    }

    if (!labName) {
      errors.labName = "Lab name is required.";
    } else if (labName.length < 2) {
      errors.labName = "Lab name must be at least 2 characters.";
    } else if (labName.length > 120) {
      errors.labName = "Lab name is too long.";
    }

    if (
      phoneNumber &&
      !/^[6-9]\d{9}$/.test(phoneNumber)
    ) {
      errors.phoneNumber =
        "Enter a valid 10-digit mobile number.";
    }

    if (
      labCode &&
      !/^[A-Za-z0-9_-]{2,30}$/.test(labCode)
    ) {
      errors.labCode =
        "Use 2-30 letters, numbers, _ or - only.";
    }

    if (registrationNumber.length > 100) {
      errors.registrationNumber =
        "Registration number is too long.";
    }

    if (address.length > 300) {
      errors.address =
        "Address must be under 300 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim(),
        labName: form.labName.trim(),
        labCode: form.labCode.trim(),
        registrationNumber:
          form.registrationNumber.trim(),
        address: form.address.trim(),
      };

      if (!payload.phoneNumber) {
        delete payload.phoneNumber;
      }

      if (!payload.labCode) {
        delete payload.labCode;
      }

      if (!payload.registrationNumber) {
        delete payload.registrationNumber;
      }

      if (!payload.address) {
        delete payload.address;
      }

      const response = await axios.post(
        `${API_BASE_URL}/admin/createLabs`,
        payload,
        requestConfig()
      );

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Unable to create lab."
        );
      }

      setDialogOpen(false);
      setForm(initialForm);
      setFormErrors({});
      setNotice("Lab created successfully.");
      await fetchLabs();
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to create lab.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (lab) => {
    if (!lab?.id || statusLabId) return;

    const currentStatus = String(
      lab?.status || ""
    ).toUpperCase();

    const nextStatus =
      currentStatus === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    try {
      setStatusLabId(lab.id);
      setError("");

      await axios.patch(
        `${API_BASE_URL}/admin/labs/${lab.id}/status`,
        {
          status: nextStatus,
        },
        requestConfig()
      );

      setLabs((currentLabs) =>
        currentLabs.map((item) =>
          item.id === lab.id
            ? {
                ...item,
                status: nextStatus,
              }
            : item
        )
      );

      setNotice(
        nextStatus === "ACTIVE"
          ? "Lab activated successfully."
          : "Lab deactivated successfully."
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Unable to update lab status."
        )
      );
    } finally {
      setStatusLabId(null);
    }
  };

  const updateField = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "phoneNumber") {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: nextValue,
    }));

    if (formErrors[name]) {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  };

  const openCreateDialog = () => {
    setForm(initialForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeCreateDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setForm(initialForm);
    setFormErrors({});
  };

  const clearFilters = () => {
    setTableSearch("");
    setTableStatus("");
    setTableDate("");
    setTablePage(1);
  };

  const statsData = [
    {
      label: "Total Labs",
      value: stats.total,
    },
    {
      label: "Active Labs",
      value: stats.active,
    },
    {
      label: "Connected Doctors",
      value: stats.doctors,
    },
    {
      label: "Test Requests",
      value: stats.requests,
    },
  ];

  const fields = [
    {
      name: "fullName",
      label: "Lab owner name",
      required: true,
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Owner email",
      required: true,
      type: "email",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Login password",
      required: true,
      type: "password",
      autoComplete: "new-password",
    },
    {
      name: "phoneNumber",
      label: "Phone number",
      inputProps: {
        maxLength: 10,
        inputMode: "numeric",
      },
    },
    {
      name: "labName",
      label: "Lab name",
      required: true,
    },
    {
      name: "labCode",
      label: "Lab code",
    },
    {
      name: "registrationNumber",
      label: "Registration number",
    },
    {
      name: "address",
      label: "Address",
      multiline: true,
      rows: 2,
    },
  ];

  const textFieldSx = {
  "& .MuiInputBase-root": {
    fontSize: "13px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "11px",
    mx: 0,
  },
};

  return (
    <Box
      sx={{
        p: {
          xs: 1.5,
          sm: 2,
          md: 2.5,
        },
        mt: {
          xs: 7,
          md: 8,
        },
        bgcolor: "white",
        minHeight: "100vh",
        overflowX: "hidden",
        "& .MuiTypography-root": {
  fontSize: "13px",
},
"& .MuiButton-root": {
  fontSize: "13px",
  textTransform: "none",
},
"& .MuiTableCell-root": {
  fontSize: "13px",
},
"& .MuiChip-label": {
  fontSize: "13px",
},
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        gap={1.5}
        mb={2}
      >
        <Box>
          <Typography
            fontWeight={700}
            sx={{
              color: theme.palette.text.primary,
              fontSize: "12.5px",
            }}
          >
            Labs
          </Typography>

          <Typography
            sx={{
              color: theme.palette.text.secondary,
              mt: 0.25,
            }}
          >
            Manage diagnostic labs and their access.
          </Typography>
        </Box>

        <Stack
          direction="row"
          gap={1}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              loading ? (
                <CircularProgress
                  size={14}
                  color="inherit"
                />
              ) : (
                <Refresh sx={{ fontSize: 17 }} />
              )
            }
            onClick={fetchLabs}
            disabled={loading}
            sx={{
              flex: {
                xs: 1,
                sm: "initial",
              },
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={
              <Add sx={{ fontSize: 17 }} />
            }
            onClick={openCreateDialog}
            sx={{
              flex: {
                xs: 1,
                sm: "initial",
              },
            }}
          >
            Add Lab
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.25,
          mb: 2,
        }}
      >
        {statsData.map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              p: {
                xs: 1.25,
                sm: 1.5,
              },
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.label}
            </Typography>

            <Typography
              fontWeight={700}
              sx={{
                color: theme.palette.primary.main,
                fontSize: "12.5px",
                mt: 0.4,
              }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={1}
          sx={{
            p: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            size="small"
            label="Search labs"
            value={tableSearch}
            onChange={(event) =>
              setTableSearch(
                event.target.value.slice(0, 100)
              )
            }
            sx={{
              ...textFieldSx,
              flex: 1,
              minWidth: {
                md: 220,
              },
            }}
          />

          <TextField
            select
            size="small"
            label="Status"
            value={tableStatus}
            onChange={(event) =>
              setTableStatus(event.target.value)
            }
            sx={{
              ...textFieldSx,
              width: {
                xs: "100%",
                md: 150,
              },
            }}
          >
            <MenuItem
              value=""
              sx={{ fontSize: "12.5px" }}
            >
              All statuses
            </MenuItem>

            <MenuItem
              value="ACTIVE"
              sx={{ fontSize: "12.5px" }}
            >
              Active
            </MenuItem>

            <MenuItem
              value="INACTIVE"
              sx={{ fontSize: "12.5px" }}
            >
              Inactive
            </MenuItem>
          </TextField>

          <TextField
            size="small"
            type="date"
            label="Created date"
            value={tableDate}
            onChange={(event) =>
              setTableDate(event.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              ...textFieldSx,
              width: {
                xs: "100%",
                md: 170,
              },
            }}
          />

          {(tableSearch ||
            tableStatus ||
            tableDate) && (
            <Button
              variant="text"
              onClick={clearFilters}
              sx={{
                whiteSpace: "nowrap",
                alignSelf: {
                  xs: "flex-start",
                  md: "center",
                },
              }}
            >
              Clear filters
            </Button>
          )}
        </Stack>

        <TableContainer
          sx={{
            maxHeight: {
              xs: "calc(100vh - 390px)",
              md: "calc(100vh - 360px)",
            },
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: 5,
              width: 5,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: theme.palette.divider,
              borderRadius: 5,
            },
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              minWidth: 850,
            }}
          >
            <TableHead>
              <TableRow>
                {columns.map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      bgcolor:
                        theme.palette.background.default,
                      whiteSpace: "nowrap",
                      py: 1.25,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <CircularProgress
                      size={26}
                      color="primary"
                    />

                    <Typography
                      sx={{
                        mt: 1,
                        color:
                          theme.palette.text.secondary,
                      }}
                    >
                      Loading labs...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                !filteredLabs.length && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      align="center"
                      sx={{ py: 6 }}
                    >
                      <Typography
                        sx={{
                          color:
                            theme.palette.text.secondary,
                        }}
                      >
                        {labs.length
                          ? "No labs match the selected filters."
                          : "No labs found."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

              {!loading &&
                visibleLabs.map((lab) => {
                  const isActive =
                    String(
                      lab?.status || ""
                    ).toUpperCase() === "ACTIVE";

                  const changing =
                    statusLabId === lab?.id;

                  return (
                    <TableRow
                      key={lab.id}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.2 }}>
                        <Typography
                          fontWeight={600}
                          sx={{
                            color:
                              theme.palette.text.primary,
                          }}
                        >
                          {lab?.lab_name || "-"}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              theme.palette.text.secondary,
                            mt: 0.2,
                          }}
                        >
                          {lab?.lab_code || "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              theme.palette.text.primary,
                          }}
                        >
                          {lab?.admin_name || "-"}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              theme.palette.text.secondary,
                            mt: 0.2,
                          }}
                        >
                          {lab?.email || "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              theme.palette.text.primary,
                          }}
                        >
                          {lab?.phone_number || "-"}
                        </Typography>

                        {lab?.address && (
                          <Typography
                            sx={{
                              color:
                                theme.palette.text.secondary,
                              mt: 0.2,
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {lab.address}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            lab?.status || "UNKNOWN"
                          }
                          color={
                            isActive
                              ? "success"
                              : "default"
                          }
                          variant="outlined"
                          sx={{
                            height: 24,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {Number(
                          lab?.doctor_count || 0
                        )}
                      </TableCell>

                      <TableCell>
                        {Number(
                          lab?.request_count || 0
                        )}
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          variant="text"
                          color={
                            isActive
                              ? "warning"
                              : "success"
                          }
                          startIcon={
                            changing ? (
                              <CircularProgress
                                size={14}
                                color="inherit"
                              />
                            ) : isActive ? (
                              <ToggleOff
                                sx={{
                                  fontSize: 17,
                                }}
                              />
                            ) : (
                              <ToggleOn
                                sx={{
                                  fontSize: 17,
                                }}
                              />
                            )
                          }
                          onClick={() =>
                            handleStatusChange(lab)
                          }
                          disabled={changing}
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isActive
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading &&
          filteredLabs.length > 0 && (
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              justifyContent="space-between"
              gap={1}
              sx={{
                p: 1.5,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                sx={{
                  color:
                    theme.palette.text.secondary,
                }}
              >
                Showing {visibleLabs.length} of{" "}
                {filteredLabs.length} results
              </Typography>

              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={tablePage}
                  onChange={(_, value) =>
                    setTablePage(value)
                  }
                  size="small"
                  color="primary"
                  siblingCount={
                    isMobile ? 0 : 1
                  }
                />
              )}
            </Stack>
          )}
      </Paper>

   <Dialog
  open={dialogOpen}
  onClose={closeCreateDialog}
  fullWidth
  maxWidth="sm"
  fullScreen={isMobile}
  PaperProps={{
    sx: {
      borderRadius: { xs: 0, sm: 2.5 },
      bgcolor: theme.palette.background.paper,
      boxShadow: { xs: "none", sm: "0 12px 35px rgba(0,0,0,0.10)" },
      overflow: "hidden",
    },
  }}
>
  <Box component="form" onSubmit={handleSubmit} noValidate>
    <DialogTitle
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: 1.75,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Typography
        component="div"
        sx={{
          fontSize: "13px",
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}
      >
        Create Lab
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: "13px",
          color: theme.palette.text.secondary,
          mt: 0.35,
        }}
      >
        Add lab details and create login access.
      </Typography>
    </DialogTitle>

    <DialogContent
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: "20px !important",
        maxHeight: { xs: "none", sm: "65vh" },
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: 5,
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: theme.palette.divider,
          borderRadius: 10,
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          columnGap: 1.5,
          rowGap: 0.5,
        }}
      >
        {fields.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={form[field.name]}
            onChange={updateField}
            required={field.required}
            type={field.type || "text"}
            error={Boolean(formErrors[field.name])}
            helperText={formErrors[field.name] || " "}
            autoComplete={field.autoComplete || "off"}
            inputProps={field.inputProps}
            multiline={field.multiline}
            rows={field.rows}
            fullWidth
            size="small"
            disabled={saving}
            sx={{
              ...textFieldSx,
              gridColumn:
                field.name === "address"
                  ? { xs: "auto", sm: "1 / -1" }
                  : "auto",
              "& .MuiOutlinedInput-root": {
                fontSize: "13px",
                borderRadius: 1.5,
                bgcolor: theme.palette.background.paper,
                "& fieldset": {
                  borderColor: theme.palette.divider,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: "1px",
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "13px",
                color: theme.palette.text.secondary,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.primary.main,
              },
              "& .MuiFormHelperText-root": {
                minHeight: 18,
                mt: 0.4,
                mx: 0.25,
                fontSize: "11px",
                lineHeight: 1.2,
              },
            }}
          />
        ))}
      </Box>
    </DialogContent>

    <DialogActions
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: 1.5,
        gap: 0.75,
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Button
        onClick={closeCreateDialog}
        disabled={saving}
        variant="outlined"
        sx={{
          minWidth: 85,
          height: 34,
          fontSize: "13px",
          borderRadius: 1.5,
          textTransform: "none",
        }}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        variant="contained"
        disabled={saving}
        sx={{
          minWidth: 105,
          height: 34,
          fontSize: "13px",
          fontWeight: 600,
          borderRadius: 1.5,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        {saving ? (
          <Stack direction="row" alignItems="center" gap={0.75}>
            <CircularProgress size={14} color="inherit" />
            <span>Creating...</span>
          </Stack>
        ) : (
          "Create Lab"
        )}
      </Button>
    </DialogActions>
  </Box>
</Dialog>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError("")}
          sx={{
            fontSize: "12.5px",
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setNotice("")}
          sx={{
            fontSize: "12.5px",
          }}
        >
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  );
}