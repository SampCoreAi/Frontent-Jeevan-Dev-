"use client";

import { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import { useTheme } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { DataTable, SectionTitle, TableFilters } from "./LabUi";

export default function LabConnections({
  connections = [],
  loading = false,
  filters,
  page = 1,
  pageSize = 10,
  onPageChange,
  actionId,
  onStatusUpdate,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    connectionId: null,
    note: "",
    error: "",
  });

  const safeConnections = Array.isArray(connections) ? connections : [];
  const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const totalPages = Math.max(
    1,
    Math.ceil(safeConnections.length / safePageSize)
  );
  const currentPage = Math.min(
    Math.max(Number(page) || 1, 1),
    totalPages
  );

  const startIndex = (currentPage - 1) * safePageSize;
  const endIndex = Math.min(
    startIndex + safePageSize,
    safeConnections.length
  );

  const visible = safeConnections.slice(startIndex, endIndex);

  const formatDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          bgcolor: "#ECFDF3",
          color: "#15803D",
          borderColor: "#BBF7D0",
        };
      case "PENDING":
        return {
          bgcolor: "#FFFBEB",
          color: "#B45309",
          borderColor: "#FDE68A",
        };
      case "REJECTED":
        return {
          bgcolor: "#FEF2F2",
          color: "#DC2626",
          borderColor: "#FECACA",
        };
      default:
        return {
          bgcolor: "#F8FAFC",
          color: "#64748B",
          borderColor: "#E2E8F0",
        };
    }
  };

  const handleStatusUpdate = async (connectionId, status, note = null) => {
    if (!connectionId || typeof onStatusUpdate !== "function") return;
    if (!["APPROVED", "REJECTED"].includes(status)) return;

    return onStatusUpdate(connectionId, status, note);
  };

  const openRejectDialog = (connectionId) => {
    setRejectDialog({ open: true, connectionId, note: "", error: "" });
  };

  const submitRejection = async () => {
    const note = rejectDialog.note.trim();
    if (!note) {
      setRejectDialog((current) => ({
        ...current,
        error: "Enter a reason before rejecting this connection.",
      }));
      return;
    }

    const succeeded = await handleStatusUpdate(
      rejectDialog.connectionId,
      "REJECTED",
      note,
    );

    if (succeeded) {
      setRejectDialog({ open: false, connectionId: null, note: "", error: "" });
    }
  };

  const handlePageChange = (_, value) => {
    if (typeof onPageChange !== "function") return;
    onPageChange(value);
  };

  const cellSx = {
    fontSize: "12.5px",
    color: "#334155",
    whiteSpace: "nowrap",
    py: 1.4,
    borderColor: "#EDF1F3",
  };

  return (
    <Box sx={{ width: "100%" , height:"100vh" , bgcolor:"white" }}>
      <SectionTitle
        title="Doctor Connections"
        description="Review and manage doctors requesting access to your laboratory."
      />

      <Box sx={{ mt: 1.5, mb: 1.5 }}>
        <TableFilters
          {...filters}
          statusOptions={["PENDING", "APPROVED", "REJECTED"]}
        />
      </Box>

      <DataTable
  columns={["DOCTOR", "EMAIL", "PHONE", "REQUESTED", "STATUS", "ACTION"]}
  loading={loading}
  emptyMessage={
    <Stack alignItems="center" spacing={0.8} sx={{ py: 3 }}>
      <PersonAddAlt1RoundedIcon sx={{ fontSize: 34, color: "#94A3B8" }} />
      <Typography sx={{ fontSize: "12px", color: "#64748B" }}>
        No new connection found
      </Typography>
    </Stack>
  }
        footer={
          safeConnections.length > 0 ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="space-between"
              gap={1.5}
              sx={{
                width: "100%",
                px: { xs: 0.5, sm: 1 },
                py: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11.5px",
                  color: "#718087",
                  whiteSpace: "nowrap",
                }}
              >
                Showing{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#334155",
                    fontWeight: 600,
                  }}
                >
                  {startIndex + 1}-{endIndex}
                </Box>{" "}
                of{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#334155",
                    fontWeight: 600,
                  }}
                >
                  {safeConnections.length}
                </Box>
              </Typography>

              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size="small"
                color="primary"
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root": {
                    minWidth: 30,
                    height: 30,
                    fontSize: "11.5px",
                    borderRadius: "6px",
                  },
                  "& .Mui-selected": {
                    fontWeight: 700,
                  },
                }}
              />
            </Stack>
          ) : null
        }
      >
        {visible.map((connection, index) => {
          const connectionId = connection?.connection_id;
          const doctorName = connection?.doctor_name || "Unknown Doctor";
          const status = String(
            connection?.status || ""
          ).toUpperCase();

          const isPending = status === "PENDING";
          const canReject = isPending || status === "APPROVED";
          const isUpdating = actionId === connectionId;
          const statusStyle = getStatusStyle(status);

          return (
            <TableRow
              key={connectionId || index}
              sx={{
                transition: "background-color 0.15s ease",
                "&:hover": {
                  bgcolor: "#F8FBFC",
                },
                "&:last-child td": {
                  borderBottom: 0,
                },
              }}
            >
              <TableCell
                sx={{
                  ...cellSx,
                  minWidth: 190,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "#E8F4F0",
                      color: "#14734F",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(doctorName) || (
                      <PersonOutlineRoundedIcon
                        sx={{ fontSize: 18 }}
                      />
                    )}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        fontWeight: 700,
                        color: "#24363D",
                        lineHeight: 1.3,
                      }}
                    >
                      {doctorName}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "9.5px",
                        color: "#8A9A9F",
                        mt: 0.2,
                      }}
                    >
                      Doctor
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  color: "#52646B",
                  maxWidth: 220,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {connection?.doctor_email || "-"}
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  color: "#52646B",
                }}
              >
                {connection?.doctor_phone || "-"}
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  color: "#718087",
                }}
              >
                {formatDate(connection?.requested_at)}
              </TableCell>

              <TableCell sx={cellSx}>
                <Chip
                  size="small"
                  label={status || "UNKNOWN"}
                  variant="outlined"
                  sx={{
                    height: 23,
                    bgcolor: "transparent",
                    color: statusStyle.color,
                    border: 0,
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  minWidth: 175,
                }}
              >
                {canReject ? (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                  >
                    {isPending && (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={isUpdating || !connectionId}
                        startIcon={
                          isUpdating ? (
                            <CircularProgress size={12} color="inherit" />
                          ) : (
                            <CheckRoundedIcon />
                          )
                        }
                        onClick={() =>
                          handleStatusUpdate(connectionId, "APPROVED")
                        }
                        sx={{
                          minWidth: 82,
                          height: 30,
                          px: 1.2,
                          bgcolor: "#15803D",
                          borderRadius: "6px",
                          fontSize: "10.5px",
                          fontWeight: 600,
                          textTransform: "none",
                          boxShadow: "none",
                          "& .MuiButton-startIcon": {
                            mr: 0.45,
                            "& svg": {
                              fontSize: 15,
                            },
                          },
                          "&:hover": {
                            bgcolor: "#166534",
                            boxShadow: "none",
                          },
                        }}
                      >
                        {isUpdating ? "Saving" : "Approve"}
                      </Button>
                    )}

                    {canReject && (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={isUpdating || !connectionId}
                        startIcon={<CloseRoundedIcon />}
                        onClick={() => openRejectDialog(connectionId)}
                        sx={{
                          minWidth: 75,
                          height: 30,
                          px: 1.1,
                          color: "#DC2626",
                          borderColor: "#FCA5A5",
                          borderRadius: "6px",
                          fontSize: "10.5px",
                          fontWeight: 600,
                          textTransform: "none",
                          "& .MuiButton-startIcon": {
                            mr: 0.35,
                            "& svg": {
                              fontSize: 15,
                            },
                          },
                          "&:hover": {
                            bgcolor: "#FEF2F2",
                            borderColor: "#EF4444",
                          },
                        }}
                      >
                        Reject
                      </Button>
                    )}
                  </Stack>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      color: "#94A3B8",
                    }}
                  >
                    No action required
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>

      <Dialog
        open={rejectDialog.open}
        onClose={() => {
          if (actionId === rejectDialog.connectionId) return;
          setRejectDialog({ open: false, connectionId: null, note: "", error: "" });
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Reject doctor connection</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.5, fontSize: 13, color: "#64748B" }}>
            Add a reason before rejecting this connection.
          </Typography>
          <TextField
            autoFocus
            required
            multiline
            minRows={3}
            fullWidth
            size="small"
            label="Rejection reason"
            value={rejectDialog.note}
            error={Boolean(rejectDialog.error)}
            helperText={rejectDialog.error}
            onChange={(event) =>
              setRejectDialog((current) => ({
                ...current,
                note: event.target.value,
                error: "",
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={actionId === rejectDialog.connectionId}
            onClick={() =>
              setRejectDialog({ open: false, connectionId: null, note: "", error: "" })
            }
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={actionId === rejectDialog.connectionId}
            onClick={submitRejection}
          >
            {actionId === rejectDialog.connectionId ? "Rejecting..." : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}