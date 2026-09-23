"use client";

import { Button, Chip, Pagination, Stack, TableCell, TableRow } from "@mui/material";
import { DataTable, SectionTitle, TableFilters } from "../../lab/components/LabUi";

export default function MedicalReports({ reports = [], loading = false, filters, page = 1, pageSize = 10, onPageChange }) {
  const safeReports = Array.isArray(reports)
    ? reports.filter((report) => String(report?.status || "").toUpperCase() === "COMPLETED")
    : [];
  const totalPages = Math.max(1, Math.ceil(safeReports.length / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const visible = safeReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
      <SectionTitle title="History" description="Track medication delivery history and patient order records." />
      <TableFilters {...filters} statusOptions={["COMPLETED"]} />
      <DataTable
        columns={["SNO", "PATIENT", "DOCTOR", "TYPE", "STATUS", "DATE"]}
        loading={loading}
        emptyMessage="No order history found."
        footer={safeReports.length > 0 ? <Pagination count={totalPages} page={currentPage - 1} onChange={(_, value) => onPageChange?.(value)} size="small" color="primary" /> : null}
      >
        {visible.map((report, index) => {
          const patientName = report?.patient_name || report?.patientName || report?.patient || "-";
          const doctorName = report?.doctor_name || report?.doctorName || report?.doctor || "-";
          const reportType = report?.type || report?.report_type || "Medicine";
          const status = String(report?.status || "COMPLETED").toUpperCase();

          return (
            <TableRow key={report?.id || report?.report_id || `${patientName}-${index}`} hover>
              <TableCell sx={{ fontSize: "12.5px", fontWeight: 600 }}>{(currentPage - 1) * pageSize + index + 1}</TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>{patientName}</TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>{doctorName}</TableCell>
              <TableCell sx={{ fontSize: "12.5px" }}>{reportType}</TableCell>
              <TableCell>
                <Chip size="small" label={status.replaceAll("_", " ")} color={getStatusColor(status)} sx={{ height: 24, fontSize: "12.5px", fontWeight: 600, "& .MuiChip-label": { px: 1 } }} />
              </TableCell>
              <TableCell sx={{ fontSize: "12.5px", color: "text.secondary" }}>{formatDate(report?.created_at || report?.requested_at || report?.date)}</TableCell>
            </TableRow>
          );
        })}
      </DataTable>
    </>
  );
}
