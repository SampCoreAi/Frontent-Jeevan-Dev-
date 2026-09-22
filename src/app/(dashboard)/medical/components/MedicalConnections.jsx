"use client";

import { Button, Chip, Pagination, Stack, TableCell, TableRow, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataTable, SectionTitle, TableFilters } from "../../lab/components/LabUi";

export default function MedicalConnections({ connections = [], loading = false, filters, page = 1, pageSize = 10, onPageChange, actionId, onStatusUpdate }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const safeConnections = Array.isArray(connections) ? connections : [];
  const totalPages = Math.max(1, Math.ceil(safeConnections.length / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const visible = safeConnections.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (value) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatusColor = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "PENDING") return "warning";
    if (status === "REJECTED") return "error";
    return "default";
  };

  const handlePageChange = (_, value) => onPageChange?.(value);

  const handleStatusUpdate = (connectionId, nextStatus) => {
    if (!connectionId || typeof onStatusUpdate !== "function") return;
    if (!["APPROVED", "REJECTED"].includes(nextStatus)) return;
    onStatusUpdate(connectionId, nextStatus);
  };

  return (
    <>
      <SectionTitle title="Doctor Connections" description="Approve or review doctors connected to your medical store." />
      <TableFilters {...filters} statusOptions={["PENDING", "APPROVED", "REJECTED"]} />
      <DataTable
        columns={["DOCTOR", "EMAIL", "PHONE", "REQUESTED", "STATUS", "ACTION"]}
        loading={loading}
        emptyMessage="No doctor connections found."
        footer={safeConnections.length > 0 ? (
          <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" sx={{ width: "100%", py: 0.5 }}>
            <Pagination count={totalPages} page={currentPage - 1} onChange={handlePageChange} size={isMobile ? "small" : "medium"} color="primary" siblingCount={isMobile ? 0 : 1} boundaryCount={1} sx={{ "& .MuiPaginationItem-root": { fontSize: "12.5px" } }} />
          </Stack>
        ) : null}
      >
        {visible.map((connection, index) => {
          const connectionId = connection?.connection_id || connection?.id;
          const doctorName = connection?.doctor_name || connection?.doctorName || connection?.full_name || "-";
          const status = String(connection?.status || "PENDING").toUpperCase();
          const isPending = status === "PENDING";
          const isUpdating = actionId === connectionId;

          return (
            <TableRow key={connectionId || `${doctorName}-${index}`} hover>
              <TableCell sx={{ fontSize: "12.5px", fontWeight: 600 }}>{doctorName}</TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>{connection?.doctor_email || connection?.email || "-"}</TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>{connection?.doctor_phone || connection?.phone || "-"}</TableCell>
              <TableCell sx={{ fontSize: "12.5px", color: "text.secondary" }}>{formatDate(connection?.requested_at || connection?.created_at)}</TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>
                <Chip size="small" label={status} color={getStatusColor(status)} variant={status === "PENDING" ? "outlined" : "filled"} sx={{ height: 24, fontSize: "12.5px", fontWeight: 600, "& .MuiChip-label": { px: 1 } }} />
              </TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>
                {isPending ? (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={0.75} alignItems={{ xs: "stretch", sm: "center" }}>
                    <Button size="small" variant="contained" color="success" disabled={isUpdating || !connectionId} onClick={() => handleStatusUpdate(connectionId, "APPROVED")} sx={{ minWidth: { xs: 80, sm: 72 }, minHeight: 30, px: 1.25, fontSize: "12.5px", textTransform: "none", boxShadow: "none" }}>
                      Accept
                    </Button>
                    <Button size="small" variant="outlined" color="error" disabled={isUpdating || !connectionId} onClick={() => handleStatusUpdate(connectionId, "REJECTED")} sx={{ minWidth: { xs: 80, sm: 68 }, minHeight: 30, px: 1.25, fontSize: "12.5px", textTransform: "none" }}>
                      Reject
                    </Button>
                  </Stack>
                ) : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>
    </>
  );
}
