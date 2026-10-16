"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search, Refresh, ScienceOutlined } from "@mui/icons-material";

import api from "../../../../utils/axiosInstance";
import LabAddTestDialog from "./LabAddTestDialog";
import { createWalkInLabTestRequest } from "../services/labRequestApi";

const statuses = [
  "PENDING",
  "REQUESTED",
  "APPROVED",
  "ACCEPTED",
  "REJECTED",
  "SAMPLE_SCHEDULED",
  "SAMPLE_COLLECTED",
  "RECOLLECTION_REQUIRED",
  "PROCESSING",
  "REPORT_READY",
  "REPORT_UPLOADED",
  "COMPLETED",
  "CANCELLED",
];

const transitions = {
  SAMPLE_SCHEDULED: ["SAMPLE_COLLECTED"],
};

const allowedStatuses = (status) => [
  status,
  ...(transitions[status] || []),
];

const statusColors = {
  COMPLETED: ["#15803d", "#dcfce7"],
  CANCELLED: ["#dc2626", "#fee2e2"],
  REJECTED: ["#dc2626", "#fee2e2"],
  SAMPLE_COLLECTED: ["#0369a1", "#e0f2fe"],
  PROCESSING: ["#6d28d9", "#ede9fe"],
  REPORT_READY: ["#047857", "#d1fae5"],
  REPORT_UPLOADED: ["#047857", "#d1fae5"],
  ACCEPTED: ["#047857", "#d1fae5"],
  APPROVED: ["#047857", "#d1fae5"],
  SAMPLE_SCHEDULED: ["#0369a1", "#e0f2fe"],
  RECOLLECTION_REQUIRED: ["#b45309", "#fef3c7"],
  REQUESTED: ["#0369a1", "#e0f2fe"],
  PENDING: ["#b45309", "#fef3c7"],
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const wrapText = {
  width: "100%",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.45,
  fontSize: 11,
  color: "#345c55",
  py: 0.75,
};

function EmptyState() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={0.6}
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 200,
        textAlign: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          bgcolor: "#def7e9",
          color: "#087755",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 0.5,
        }}
      >
        <ScienceOutlined sx={{ fontSize: 34 }} />
      </Box>

      <Typography sx={{ fontSize: 13, fontWeight: 750, color: "#147451" }}>
        No records found
      </Typography>

      <Typography sx={{ fontSize: 11, color: "#6a91a0" }}>
        Try changing your filters or add a new test.
      </Typography>
    </Stack>
  );
}

function StatusCell({ value, row, onStatusChange, actionId }) {
  const status = value || "PENDING";
  const [color, background] = statusColors[status] || [
    "#b45309",
    "#fef3c7",
  ];

  return (
    <Stack spacing={0.7} sx={{ width: "100%", py: 0.75 }}>
      <Box
        sx={{
          alignSelf: "flex-start",
          maxWidth: "100%",
          px: 0.8,
          py: 0.5,
          borderRadius: "6px",
          color,
          bgcolor: background,
          fontSize: 9,
          fontWeight: 750,
          whiteSpace: "normal",
          overflowWrap: "anywhere",
          lineHeight: 1.4,
        }}
      >
        {status.replaceAll("_", " ")}
      </Box>

      <Select
        size="small"
        fullWidth
        value={status}
        disabled={actionId === row.id || status === "CANCELLED"}
        onChange={(event) => onStatusChange(row.id, event.target.value)}
        sx={{
          fontSize: 10,
          bgcolor: "#ffffffb8",
          borderRadius: "7px",
          "& .MuiSelect-select": {
            py: 0.8,
            px: 0.7,
            whiteSpace: "normal",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#deeee7",
          },
        }}
      >
        {statuses.map((option) => (
          <MenuItem
            key={option}
            value={option}
            disabled={!allowedStatuses(status).includes(option)}
            sx={{ fontSize: 10, whiteSpace: "normal" }}
          >
            {option.replaceAll("_", " ")}
          </MenuItem>
        ))}
      </Select>

      {actionId === row.id && (
        <CircularProgress size={15} sx={{ color: "#087755" }} />
      )}
    </Stack>
  );
}

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date: "",
  });

  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [pagination, setPagination] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/lab-technicians/tasks", {
        params: {
          search: filters.search || undefined,
          status: filters.status || undefined,
          date: filters.date || undefined,
          page: page + 1,
          pageSize,
        },
      });

      setTasks(response.data?.data || []);
      setPagination(response.data?.pagination || null);
      setError("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load assigned lab work."
      );
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.status, filters.date, page]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value || "",
    }));
    setPage(0);
  };

  const resetFilters = () => {
    setFilters({ search: "", status: "", date: "" });
    setPage(0);
  };

  const updateStatus = async (requestId, status) => {
    try {
      setActionId(requestId);
      setError("");

      await api.patch(`/api/lab-technicians/${requestId}/status`, {
        status,
      });

      await loadTasks();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to update task status."
      );
    } finally {
      setActionId(null);
    }
  };

  const createTestRequest = async (requestDetails) => {
    try {
      const created = await createWalkInLabTestRequest(requestDetails);

      return {
        success: true,
        patientId: created.patientId,
        requestId: created.requestId,
        orderId: created.orderId,
        request: created.request,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create test request.";

      setError(message);
      return { success: false, message };
    }
  };

  const columns = [
    {
      field: "order_id",
      headerName: "ORDER ID",
      flex: 0.8,
      minWidth: 65,
      sortable: true,
      renderCell: ({ value, row }) => (
        <Typography
          sx={{
            ...wrapText,
            color: "#087755",
            fontWeight: 750,
          }}
        >
          {value || `#${row.id}`}
        </Typography>
      ),
    },
    {
      field: "created_at",
      headerName: "REQUEST DATE",
      flex: 1,
      minWidth: 75,
      valueFormatter: (value) => formatDate(value),
      renderCell: ({ value }) => <Box sx={wrapText}>{formatDate(value)}</Box>,
    },
    {
      field: "expected_report_at",
      headerName: "REPORT BY",
      flex: 1,
      minWidth: 75,
      renderCell: ({ value }) => <Box sx={wrapText}>{formatDate(value)}</Box>,
    },
    {
      field: "collection_slot",
      headerName: "COLLECTION SLOT",
      flex: 1,
      minWidth: 75,
      sortable: false,
      valueGetter: (value, row) => value || row.collectionSlot || "",
      renderCell: ({ value }) => (
        <Box sx={wrapText}>
          {value ? formatDate(value) : "Not scheduled"}
        </Box>
      ),
    },
    {
      field: "collection_token",
      headerName: "TOKEN",
      flex: 0.65,
      minWidth: 55,
      sortable: false,
      valueGetter: (value, row) => value || row.collectionToken || "",
      renderCell: ({ value }) => (
        <Box sx={wrapText}>{value || "Not assigned"}</Box>
      ),
    },
    {
      field: "patient_name",
      headerName: "PATIENT DETAILS",
      flex: 1.35,
      minWidth: 95,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack spacing={0.2} sx={{ width: "100%", py: 0.8 }}>
          <Typography sx={{ ...wrapText, fontWeight: 750, py: 0 }}>
            {row.patient_name || "-"}
          </Typography>
          <Typography sx={{ ...wrapText, color: "#78928b", py: 0 }}>
            {row.patient_age || "Age -"} · {row.patient_gender || "Gender -"}
          </Typography>
          <Typography sx={{ ...wrapText, color: "#78928b", py: 0 }}>
            {row.patient_phone || row.patient_email || "Contact unavailable"}
          </Typography>
          <Typography sx={{ ...wrapText, color: "#78928b", py: 0 }}>
            {row.patient_address || "Address unavailable"}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "lab_name",
      headerName: "LAB",
      flex: 1,
      minWidth: 70,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack spacing={0.2} sx={{ width: "100%", py: 0.8 }}>
          <Typography sx={{ ...wrapText, fontWeight: 700, py: 0 }}>
            {row.lab_name || "-"}
          </Typography>
          <Typography sx={{ ...wrapText, color: "#78928b", py: 0 }}>
            {row.lab_address || row.lab_phone || "-"}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "sample_type",
      headerName: "SAMPLE",
      flex: 0.7,
      minWidth: 55,
      sortable: false,
      renderCell: ({ value }) => (
        <Box sx={wrapText}>{value || "-"}</Box>
      ),
    },
    {
      field: "requested_tests",
      headerName: "TESTS",
      flex: 1,
      minWidth: 65,
      sortable: false,
      renderCell: ({ value }) => (
        <Box sx={wrapText}>
          {Array.isArray(value) ? value.join(", ") : value || "-"}
        </Box>
      ),
    },
    {
      field: "collection_instructions",
      headerName: "INSTRUCTIONS",
      flex: 1,
      minWidth: 70,
      sortable: false,
      valueGetter: (value, row) =>
        value || row.collectionInstructions || "No special instructions",
      renderCell: ({ value }) => <Box sx={wrapText}>{value}</Box>,
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      minWidth: 85,
      sortable: false,
      renderCell: ({ value, row }) => (
        <StatusCell
          value={value}
          row={row}
          onStatusChange={updateStatus}
          actionId={actionId}
        />
      ),
    },
  ];

  const rows = tasks.map((task) => ({
    ...task,
    id: task.id,
  }));

  const totalRows =
    pagination?.totalItems ??
    pagination?.total ??
    (pagination?.totalPages
      ? pagination.totalPages * pageSize
      : rows.length);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        boxSizing: "border-box",
        mt:8,
        background:
          "white",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1800,
          mx: "auto",
          p: { xs: 1.5, sm: 2.2 },
          boxSizing: "border-box",
          borderRadius: "12px",
          bgcolor: "rgba(255,255,255,0.64)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 5px 18px rgba(23,104,78,0.08)",
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          gap={2}
          sx={{ pb: 2, borderBottom: "1px solid #e4f0eb" }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                borderRadius: "12px",
                bgcolor: "#e1f6ed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#087755",
              }}
            >
              <ScienceOutlined sx={{ fontSize: 29 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 19, sm: 21 },
                  fontWeight: 750,
                  color: "#08724f",
                  lineHeight: 1.3,
                }}
              >
                Technician Dashboard
              </Typography>
              <Typography sx={{ mt: 0.3, fontSize: 12, color: "#648b99" }}>
                Review assigned lab work and keep each task status current.
              </Typography>
            </Box>
          </Stack>

          <LabAddTestDialog
            onCreateRequest={createTestRequest}
            successMessage="The request was sent to your lab. It will appear in your assigned tasks after the lab assigns it."
          />
        </Stack>

        {/* Filters */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(0, 1.8fr) minmax(0, 1fr) minmax(0, 1fr) auto",
            },
            gap: 1.5,
            alignItems: "center",
            my: 1.8,
            p: 1.3,
            borderRadius: "11px",
            border: "1px solid #e2f0ea",
            bgcolor: "rgba(234,247,241,0.45)",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search patient, order ID, test..."
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#42776b", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Select
            fullWidth
            size="small"
            displayEmpty
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            sx={inputSx}
          >
            <MenuItem value="">All statuses</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status} sx={{ fontSize: 12 }}>
                {status.replaceAll("_", " ")}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            size="small"
            type="date"
            value={filters.date}
            onChange={(event) => updateFilter("date", event.target.value)}
            sx={inputSx}
            inputProps={{ "aria-label": "Filter by date" }}
          />

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={resetFilters}
            sx={{
              height: 42,
              px: 2,
              borderRadius: "10px",
              textTransform: "none",
              whiteSpace: "nowrap",
              fontSize: 12,
              fontWeight: 700,
              color: "#28594e",
              borderColor: "#e0eee8",
              bgcolor: "#ffffff70",
              "&:hover": {
                bgcolor: "#e8f7ef",
                borderColor: "#8fc7b1",
              },
            }}
          >
            Reset
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Responsive table: no horizontal scrolling */}
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
            border: "1px solid #deeee7",
            borderRadius: "11px",
            bgcolor: "rgba(255,255,255,0.45)",

            "& .MuiDataGrid-root": {
              width: "100%",
              minWidth: 0,
              border: 0,
              color: "#345c55",
              fontSize: 11,
              backgroundColor: "transparent",
            },

            "& .MuiDataGrid-main": {
              minWidth: 0,
              overflow: "hidden",
            },

            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#e8f6ef",
              borderBottom: "1px solid #dceee5",
              minHeight: "48px !important",
              maxHeight: "none !important",
            },

            "& .MuiDataGrid-columnHeader": {
              minWidth: "0 !important",
              padding: "0 3px",
              borderRight: "1px solid #deeee7",
              outline: "none",
            },

            "& .MuiDataGrid-columnHeaderTitleContainer": {
              minWidth: 0,
              overflow: "hidden",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              lineHeight: 1.3,
              fontSize: 9,
              fontWeight: 750,
              color: "#28685d",
            },

            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },

            "& .MuiDataGrid-menuIcon": {
              width: "20px !important",
              minWidth: "20px !important",
              visibility: "visible !important",
              opacity: "1 !important",
              marginRight: 0,
            },

            "& .MuiDataGrid-menuIconButton": {
              width: "20px",
              height: "24px",
              padding: 0,
              color: "#39776a",
              visibility: "visible !important",
              opacity: "1 !important",
            },

            "& .MuiDataGrid-cell": {
              minWidth: "0 !important",
              padding: "3px 5px",
              borderRight: "1px solid #e5f0ec",
              borderBottom: "1px solid #e5f0ec",
              whiteSpace: "normal",
              overflow: "hidden",
              lineHeight: 1.4,
              display: "flex",
              alignItems: "center",
              outline: "none",
            },

            "& .MuiDataGrid-row": {
              bgcolor: "#ffffff50",
            },

            "& .MuiDataGrid-row:hover": {
              bgcolor: "#f0faf5",
            },

            "& .MuiDataGrid-row.Mui-selected": {
              bgcolor: "#e8f6ef",
            },

            "& .MuiDataGrid-virtualScroller": {
              overflowX: "hidden !important",
              overflowY: "hidden !important",
            },

            "& .MuiDataGrid-virtualScrollerContent": {
              minWidth: "0 !important",
            },

            "& .MuiDataGrid-virtualScrollerRenderZone": {
              minWidth: "0 !important",
            },

            "& .MuiDataGrid-footerContainer": {
              minHeight: 48,
              borderTop: "1px solid #deeee7",
              color: "#648b99",
            },

            "& .MuiTablePagination-root": {
              color: "#648b99",
              fontSize: 11,
            },

            "& .MuiDataGrid-overlay": {
              bgcolor: "rgba(255,255,255,0.45)",
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            autoHeight
            getRowHeight={() => "auto"}
            getEstimatedRowHeight={() => 80}
            pagination
            paginationMode="server"
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model) => {
              if (model.page !== page) setPage(model.page);
            }}
            pageSizeOptions={[10]}
            rowCount={totalRows}
            disableRowSelectionOnClick
            disableColumnSelector={false}
            disableColumnFilter={false}
            disableColumnMenu={false}
            hideFooterSelectedRowCount
            slots={{
              noRowsOverlay: EmptyState,
              loadingOverlay: () => (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  sx={{ height: "100%", minHeight: 180 }}
                >
                  <CircularProgress size={28} sx={{ color: "#087755" }} />
                  <Typography sx={{ fontSize: 12, color: "#648b99" }}>
                    Loading assigned lab work...
                  </Typography>
                </Stack>
              ),
            }}
            sx={{
              "& .MuiDataGrid-virtualScroller": {
                minHeight: tasks.length === 0 ? "230px" : "unset",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

const inputSx = {
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: "11px",
    backgroundColor: "#ffffffb8",
    fontSize: "12px",
    height: "42px",
    "& fieldset": { borderColor: "#e2efea" },
    "&:hover fieldset": { borderColor: "#9bcbbb" },
    "&.Mui-focused fieldset": { borderColor: "#08785b" },
  },
  "& .MuiInputBase-input": {
    color: "#28564c",
    minWidth: 0,
  },
};
