"use client";

import { useState } from "react";
import { Chip, IconButton, MenuItem, Pagination, Select, Stack, TableCell, TableRow, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { DataTable, SectionTitle, TableFilters } from "../../lab/components/LabUi";
import MedicalRequestDetailsDialog from "./MedicalRequestDetailsDialog";

const REQUEST_STATUSES = ["PENDING", "APPROVED", "PROCESSING", "READY_FOR_PICKUP", "COMPLETED", "REJECTED", "CANCELLED"];

export default function MedicalRequests({ requests = [], loading = false, filters, page = 1, pageSize = 10, onPageChange, actionId = null, onStatusUpdate }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const safeRequests = Array.isArray(requests) ? requests : [];
  const totalPages = Math.max(1, Math.ceil(safeRequests.length / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const visible = safeRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (value) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatusColor = (status) => {
    if (status === "COMPLETED") return "success";
    if (status === "READY_FOR_PICKUP") return "info";
    if (status === "PROCESSING") return "warning";
    if (status === "REJECTED" || status === "CANCELLED") return "error";
    return "default";
  };

  return (
    <>
      <SectionTitle title="Medical Requests" description="Review medicine requests from connected doctors and patients." />
      <TableFilters {...filters} statusOptions={REQUEST_STATUSES} />
      <DataTable
        columns={["SNO", "PATIENT", "DOCTOR", "DATE", "STATUS", "UPDATE", "VIEW"]}
        loading={loading}
        emptyMessage="No medical requests found."
        footer={safeRequests.length > 0 ? <Pagination count={totalPages} page={currentPage - 1} onChange={(_, value) => onPageChange?.(value)} size="small" color="primary" /> : null}
      >
        {visible.map((request, index) => {
          const patientName = request?.patient_name || request?.patientName || request?.patient || "-";
          const doctorName = request?.doctor_name || request?.doctorName || request?.doctor || "-";
          const status = String(request?.status || "PENDING").toUpperCase();

          return (
            <TableRow key={request?.id || request?.request_id || `${patientName}-${index}`} hover>
              <TableCell sx={{ fontSize: "12.5px", fontWeight: 600 }}>{(currentPage - 1) * pageSize + index + 1}</TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>{patientName}</TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>{doctorName}</TableCell>
              <TableCell sx={{ fontSize: "12.5px", color: "text.secondary" }}>{formatDate(request?.requested_at || request?.created_at || request?.date)}</TableCell>
              <TableCell>
                <Chip size="small" label={status.replaceAll("_", " ")} color={getStatusColor(status)} sx={{ height: 24, fontSize: "12.5px", fontWeight: 600, "& .MuiChip-label": { px: 1 } }} />
                {Number(request?.request_version || 1) > 1 ? <Chip size="small" label="UPDATED" color="info" sx={{ ml: 0.5, height: 22, fontSize: "10px" }} /> : <Chip size="small" label="NEW" color="warning" variant="outlined" sx={{ ml: 0.5, height: 22, fontSize: "10px" }} />}
              </TableCell>
              <TableCell sx={{ minWidth: 150 }}>
                <Select
                  size="small"
                  value={status}
                  disabled={Boolean(actionId && Number(actionId) === Number(request?.id))}
                  onChange={(event) => {
                    const nextStatus = event.target.value;
                    if (nextStatus === "COMPLETED") {
                      setSelectedRequest(request);
                      return;
                    }
                    onStatusUpdate?.(request?.id, nextStatus, request?.note || null);
                  }}
                  sx={{ width: 150, fontSize: "12.5px" }}
                >
                  {REQUEST_STATUSES.map((option) => (
                    <MenuItem key={option} value={option}>{option.replaceAll("_", " ")}</MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Tooltip title="View request details">
                  <IconButton size="small" color="primary" onClick={() => setSelectedRequest(request)} aria-label={`View medical request for ${patientName}`}>
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>
      <MedicalRequestDetailsDialog
        open={Boolean(selectedRequest)}
        request={selectedRequest}
        loading={Boolean(actionId && selectedRequest && Number(actionId) === Number(selectedRequest.id))}
        onClose={() => setSelectedRequest(null)}
        onComplete={(requestId, nextStatus, note, details) => {
          onStatusUpdate?.(requestId, nextStatus, note, details);
          setSelectedRequest(null);
        }}
      />
    </>
  );
}
