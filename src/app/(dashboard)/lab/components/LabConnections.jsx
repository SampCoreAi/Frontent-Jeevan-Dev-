"use client";

import {
  Button,
  Chip,
  Pagination,
  Stack,
  TableCell,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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

  const safeConnections = Array.isArray(connections) ? connections : [];
  const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const totalPages = Math.max(1, Math.ceil(safeConnections.length / safePageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const visible = safeConnections.slice(
    (currentPage - 1) * safePageSize,
    currentPage * safePageSize
  );

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

  const getStatusColor = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "PENDING") return "warning";
    if (status === "REJECTED") return "error";
    return "default";
  };

  const handleStatusUpdate = (connectionId, status) => {
    if (!connectionId || typeof onStatusUpdate !== "function") return;
    if (!["APPROVED", "REJECTED"].includes(status)) return;
    onStatusUpdate(connectionId, status);
  };

  const handlePageChange = (_, value) => {
    if (typeof onPageChange !== "function") return;
    onPageChange(value);
  };

  const cellSx = {
    fontSize: "12.5px",
    color: "text.primary",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <SectionTitle
        title="Doctor Connections"
        description="Approve or reject doctors requesting access to your lab."
      />

      <TableFilters
        {...filters}
        statusOptions={["PENDING", "APPROVED", "REJECTED"]}
      />

      <DataTable
        columns={[
          "DOCTOR",
          "EMAIL",
          "PHONE",
          "REQUESTED",
          "STATUS",
          "ACTION",
        ]}
        loading={loading}
        emptyMessage="No doctor connections found."
        footer={
          safeConnections.length > 0 ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="center"
              sx={{ width: "100%", py: 0.5 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size={isMobile ? "small" : "medium"}
                color="primary"
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 1}
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "12.5px",
                  },
                }}
              />
            </Stack>
          ) : null
        }
      >
        {visible.map((connection) => {
          const connectionId = connection?.connection_id;
          const status = String(connection?.status || "").toUpperCase();
          const isPending = status === "PENDING";
          const isUpdating = actionId === connectionId;

          return (
            <TableRow key={connectionId} hover>
              <TableCell
                sx={{
                  ...cellSx,
                  fontWeight: 600,
                }}
              >
                {connection?.doctor_name || "-"}
              </TableCell>

              <TableCell sx={cellSx}>
                {connection?.doctor_email || "-"}
              </TableCell>

              <TableCell sx={cellSx}>
                {connection?.doctor_phone || "-"}
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  color: "text.secondary",
                }}
              >
                {formatDate(connection?.requested_at)}
              </TableCell>

              <TableCell sx={cellSx}>
                <Chip
                  size="small"
                  label={status || "-"}
                  color={getStatusColor(status)}
                  variant={status === "PENDING" ? "outlined" : "filled"}
                  sx={{
                    height: 24,
                    fontSize: "12.5px",
                    fontWeight: 600,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              </TableCell>

              <TableCell sx={cellSx}>
                {isPending ? (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={0.75}
                    alignItems={{ xs: "stretch", sm: "center" }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      disabled={isUpdating || !connectionId}
                      onClick={() =>
                        handleStatusUpdate(connectionId, "APPROVED")
                      }
                      sx={{
                        minWidth: { xs: 80, sm: 72 },
                        minHeight: 30,
                        px: 1.25,
                        fontSize: "12.5px",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "none",
                        },
                      }}
                    >
                      Approve
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled={isUpdating || !connectionId}
                      onClick={() =>
                        handleStatusUpdate(connectionId, "REJECTED")
                      }
                      sx={{
                        minWidth: { xs: 80, sm: 68 },
                        minHeight: 30,
                        px: 1.25,
                        fontSize: "12.5px",
                        textTransform: "none",
                      }}
                    >
                      Reject
                    </Button>
                  </Stack>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>
    </>
  );
}